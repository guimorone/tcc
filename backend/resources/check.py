import os
import json
import traceback
import cv2
import pytesseract
import pytz
import difflib
import numpy as np
from uuid import uuid4
from PIL import Image
from datetime import datetime, timezone
from typing import List, Dict, Tuple, Any, Literal
from flask_restful import Resource, request
from flask_restful.reqparse import FileStorage
from google.cloud import vision
from google.oauth2.service_account import Credentials
from utils.misc import check_if_word_is_correct, draw_missing_words, read_xml
from utils.exceptions import BackendError


class Check(Resource):
    def get_google_vision_client(self) -> vision.ImageAnnotatorClient:
        try:
            credentials = Credentials.from_service_account_info(self.google_service_account_credentials)
            return vision.ImageAnnotatorClient(credentials=credentials)
        except Exception as err:
            raise BackendError('Invalid Google Service Account Credentials: \n{}'.format(str(err)))

    def opencv_process(
        self, screenshot: FileStorage, split_word: bool, get_only_text: bool
    ) -> Tuple[str, List[str], bytes | None] | Tuple[List[str], List[str]]:
        tesseract_path = os.environ.get('TESSERACT_PATH')
        if not tesseract_path:
            raise BackendError('Tesseract path is required')

        pytesseract.pytesseract.tesseract_cmd = tesseract_path
        content = screenshot.read()

        # CV2
        nparr = np.fromstring(content, np.uint8)
        img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)
        _, thresh1 = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)
        rect_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (18, 18))
        # Applying dilation on the threshold image
        dilation = cv2.dilate(thresh1, rect_kernel, iterations=1)
        # Finding contours
        contours, _ = cv2.findContours(dilation, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

        incorrect_words = []
        bounds = []
        for cnt in contours:
            x, y, width, height = cv2.boundingRect(cnt)
            cropped = img_np[y : y + height, x : x + width]
            text = pytesseract.image_to_string(cropped)
            word = text.strip().lower()
            if get_only_text:
                incorrect_words.append(word)
                bounds.append([(x, y), (x + width, y), (x + width, y + height), (x, y + height)])
                continue
            texts = word.split()
            if not split_word or len(texts) <= 1:
                if check_if_word_is_correct(
                    word, self.language, self.custom_dict, self.dict_usage_type, self.ignore_words
                ):
                    continue

                if word not in incorrect_words:
                    incorrect_words.append(word)
            else:
                all_correct = True
                for t in texts:
                    if check_if_word_is_correct(
                        t, self.language, self.custom_dict, self.dict_usage_type, self.ignore_words
                    ):
                        continue

                    all_correct = False
                    if t not in incorrect_words:
                        incorrect_words.append(t)
                if all_correct:
                    continue

            bounds.append([(x, y), (x + width, y), (x + width, y + height), (x, y + height)])

        if not get_only_text:
            drawn_image = draw_missing_words(Image.open(screenshot), bounds)
            return screenshot.filename, incorrect_words, drawn_image

        return incorrect_words, bounds

    def google_process(
        self, screenshot: FileStorage, split_word: bool, get_only_text: bool
    ) -> Tuple[str, List[str], bytes | None] | Tuple[List[str], List[str]]:
        client = self.get_google_vision_client()
        content = screenshot.read()
        image = vision.Image(content=content)
        response = client.text_detection(image=image)
        if response.error.message:
            raise BackendError(
                "{}\nFor more info on error messages, check: "
                "https://cloud.google.com/apis/design/errors".format(response.error.message)
            )

        texts = response.text_annotations
        incorrect_words = []
        bounds = []
        for text in texts:
            word = text.description.strip().lower()
            if get_only_text:
                incorrect_words.append(word)
                bounds.append([(vertex.x, vertex.y) for vertex in text.bounding_poly.vertices])
                continue
            word_splitted = word.split()
            if not split_word or len(word_splitted) <= 1:
                if check_if_word_is_correct(
                    word, self.language, self.custom_dict, self.dict_usage_type, self.ignore_words
                ):
                    continue

                if word not in incorrect_words:
                    incorrect_words.append(word)
            else:
                all_correct = True
                for w in word_splitted:
                    if check_if_word_is_correct(
                        w, self.language, self.custom_dict, self.dict_usage_type, self.ignore_words
                    ):
                        continue

                    all_correct = False
                    if w not in incorrect_words:
                        incorrect_words.append(w)
                if all_correct:
                    continue

            bounds.append([(vertex.x, vertex.y) for vertex in text.bounding_poly.vertices])

        if not get_only_text:
            drawn_image = draw_missing_words(Image.open(screenshot), bounds)

            return screenshot.filename, incorrect_words, drawn_image

        return incorrect_words, bounds

    def process_screenshot(
        self, screenshot: FileStorage, split_word: bool = False, get_only_text: bool = False
    ) -> Tuple[str, List[str], bytes | None] | Tuple[List[str], List[str]]:
        if not self.use_google_cloud_vision:
            return self.opencv_process(screenshot, split_word, get_only_text)

        return self.google_process(screenshot, split_word, get_only_text)

    def image_request(self) -> Tuple[Dict[str, Any], int]:
        screenshots = request.files.getlist('images')
        if not screenshots or not len(screenshots):
            raise BackendError('At least one image is required')

        dict_file: FileStorage | None = request.files.get('dict_file', None)
        data = {
            'id': str(uuid4()),
            'time': datetime.now(timezone.utc)
            .astimezone(pytz.timezone('America/Recife'))
            .strftime('%d/%m/%Y %H:%M:%S GMT%:z'),
            'language': self.language,
            'type': 'image',
            'files': [],
            'ignore_words': self.ignore_words,
            'google_cloud_vision_used': self.use_google_cloud_vision,
            'custom_dict_used': (
                {'filename': dict_file.filename, 'usage_type': self.dict_usage_type} if dict_file else None
            ),
        }

        for screenshot in screenshots:
            filename, incorrect_words, drawn_image = self.process_screenshot(screenshot)
            data['files'].append(
                {
                    'filename': filename,
                    'words': incorrect_words,
                    'image': drawn_image.decode('utf-8') if drawn_image else None,
                }
            )

        return data, 200

    def dump_request(self) -> Tuple[Dict[str, Any], int]:
        image = request.files.get('image')
        if not image:
            raise BackendError('One image is required')

        xml = request.files.get('xml')
        if not xml:
            raise BackendError('One xml file is required')

        dict_file: FileStorage | None = request.files.get('dict_file', None)
        data = {
            'id': str(uuid4()),
            'time': datetime.now(timezone.utc)
            .astimezone(pytz.timezone('America/Recife'))
            .strftime('%d/%m/%Y %H:%M:%S GMT%:z'),
            'language': self.language,
            'type': 'dump',
            'files': [
                {
                    'filename': image.filename,
                    'words': [],
                    'image': None,
                }
            ],
            'ignore_words': self.ignore_words,
            'google_cloud_vision_used': self.use_google_cloud_vision,
            'custom_dict_used': (
                {'filename': dict_file.filename, 'usage_type': self.dict_usage_type} if dict_file else None
            ),
        }

        words_xml = read_xml(xml)
        words_ocr, bounds_ocr = self.process_screenshot(image, get_only_text=True)

        def is_similar(word: str, target: str) -> bool:
            return difflib.SequenceMatcher(None, word.lower(), target.lower()).ratio() > 0.85

        incorrect_words = []
        bounds = []
        for word_xml in words_xml:
            for index, word_ocr in enumerate(words_ocr):
                if not is_similar(word_xml, word_ocr) or check_if_word_is_correct(
                    word_xml, self.language, self.custom_dict, self.dict_usage_type, self.ignore_words
                ):
                    continue

                incorrect_words.append(word_xml)
                bounds.append(bounds_ocr[index])

        drawn_image = draw_missing_words(Image.open(image), bounds)

        data['files'][0]['words'] = list(set(incorrect_words))
        data['files'][0]['image'] = drawn_image.decode('utf-8') if drawn_image else None

        return data, 200

    def post(self, request_type: str = '') -> Tuple[Dict[str, Any], int]:
        available_request_types = {'image': self.image_request, 'dump': self.dump_request}
        if request_type not in available_request_types:
            return {'message': 'Invalid Request Type'}, 404

        try:
            self.language: str = request.form.get('language', '')
            if not self.language:
                raise BackendError('Language is required')

            self.use_google_cloud_vision: bool = json.loads(request.form.get('use_google_cloud_vision', 'true'))
            self.google_service_account_credentials: Dict[str, str] | None = None
            if self.use_google_cloud_vision:
                try:
                    self.google_service_account_credentials: Dict[str, str] | None = json.loads(
                        request.form.get('google_service_account_credentials', 'null')
                    )
                    if not self.google_service_account_credentials:
                        raise BackendError('Google Service Account Credentials are required')
                except:
                    raise BackendError('Invalid Google Service Account Credentials')

            self.dict_usage_type: Literal['complement', 'replacement'] = request.form.get(
                'dict_usage_type', 'complement'
            )
            self.ignore_words: List[str] = json.loads(request.form.get('ignore_words', '[]'))
            dict_file: FileStorage | None = request.files.get('dict_file', None)
            if dict_file:
                lines = dict_file.read().splitlines()
                self.custom_dict = [line.decode('utf-8').strip().lower() for line in lines]

            return available_request_types[request_type]()
        except BackendError as err:
            return {'message': str(err)}, 400
        except:
            traceback.print_exc()
            return {'message': 'Internal Server Error'}, 500
