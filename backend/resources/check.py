import os
import json
import traceback
import cv2
import pytesseract
import numpy as np
from PIL import Image
from datetime import datetime
from uuid import uuid4
from typing import List, Dict, Tuple, Any, Literal
from flask_restful import Resource, request
from flask_restful.reqparse import FileStorage
from google.cloud import vision
from google.oauth2 import service_account
from utils.misc import check_if_word_is_correct, draw_missing_words
from utils.exceptions import BackendError


class Check(Resource):
    def get_google_vision_client(self) -> vision.ImageAnnotatorClient:
        try:
            credentials = service_account.Credentials.from_service_account_info(self.google_service_account_credentials)
            return vision.ImageAnnotatorClient(credentials=credentials)
        except Exception as err:
            raise BackendError('Invalid Google Service Account Credentials: \n{}'.format(str(err)))

    def open_cv_process(self, screenshot: FileStorage) -> Tuple[str, List[str], bytes | None]:
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
            texts = word.split()
            if len(texts) > 1:
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
            else:
                if check_if_word_is_correct(
                    word, self.language, self.custom_dict, self.dict_usage_type, self.ignore_words
                ):
                    continue

                if word not in incorrect_words:
                    incorrect_words.append(word)

            bounds.append([(x, y), (x + width, y), (x + width, y + height), (x, y + height)])

        drawn_image = draw_missing_words(Image.open(screenshot), bounds)

        return screenshot.filename, incorrect_words, drawn_image

    def google_process(self, screenshot: FileStorage) -> Tuple[str, List[str], bytes | None]:
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
            word_splitted = word.split()
            if len(word_splitted) > 1:
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
            else:
                if check_if_word_is_correct(
                    word, self.language, self.custom_dict, self.dict_usage_type, self.ignore_words
                ):
                    continue

                if word not in incorrect_words:
                    incorrect_words.append(word)

            bounds.append([(vertex.x, vertex.y) for vertex in text.bounding_poly.vertices])

        drawn_image = draw_missing_words(Image.open(screenshot), bounds)

        return screenshot.filename, incorrect_words, drawn_image

    def process_screenshot(self, screenshot: FileStorage) -> Tuple[str, List[str], bytes | None]:
        if not self.use_google_cloud_vision:
            return self.open_cv_process(screenshot)

        return self.google_process(screenshot)

    def image_request(self) -> Tuple[Dict[str, Any], int]:
        screenshots = request.files.getlist('images')
        if not screenshots or not len(screenshots):
            raise BackendError('At least one image is required')

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

        dict_file: FileStorage | None = request.files.get('dict_file', None)
        self.dict_usage_type: Literal['complement', 'replacement'] = request.form.get('dict_usage_type', 'complement')
        self.ignore_words: List[str] = json.loads(request.form.get('ignore_words', '[]'))
        data = {
            'id': str(uuid4()),
            'time': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
            'language': self.language,
            'type': 'image',
            'files': [],
            'ignore_words': self.ignore_words,
            'google_cloud_vision_used': self.use_google_cloud_vision,
            'custom_dict_used': (
                {'filename': dict_file.filename, 'usage_type': self.dict_usage_type} if dict_file else None
            ),
        }
        self.custom_dict: List[str] | None = None
        if dict_file:
            lines = dict_file.read().splitlines()
            self.custom_dict = [line.decode('utf-8').strip().lower() for line in lines]

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
        return {'message': 'Not implemented yet'}, 501

    def post(self, request_type: str = '') -> Tuple[Dict[str, Any], int]:
        available_request_types = {'image', 'dump'}
        if request_type not in available_request_types:
            return {'message': 'Invalid request type'}, 404

        try:
            if request_type == 'image':
                return self.image_request()

            return self.dump_request()
        except BackendError as err:
            return {'message': str(err)}, 400
        except:
            traceback.print_exc()
            return {'message': 'Internal Server Error'}, 500
