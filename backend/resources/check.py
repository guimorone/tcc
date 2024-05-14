import os
import re
import json
import traceback
from io import BytesIO
from base64 import b64encode
from PIL import Image, ImageDraw
from datetime import datetime
from uuid import uuid4
from typing import Dict, List, Tuple
from flask_restful import Resource, request
from google.cloud import vision
from google.oauth2 import service_account
from PyMultiDictionary import MultiDictionary
from utils.misc import ignore_word


class Check(Resource):
    def __init__(self, *args, **kwargs) -> None:
        service_account_info = json.loads(os.getenv('GOOGLE_CREDENTIALS'))
        credentials = service_account.Credentials.from_service_account_info(service_account_info)
        self.__google_client: vision.ImageAnnotatorClient = vision.ImageAnnotatorClient(credentials=credentials)
        super().__init__(*args, **kwargs)

    def draw_missing_words(self, image: Image, bounds: Dict[str, List[Tuple[float, float]]]) -> bytes | None:
        offset = 3
        try:
            draw = ImageDraw.Draw(image)
            for vertices in bounds.values():
                width, height = image.size
                if len(vertices) != 4:
                    continue
                x1, y1 = vertices[0]
                if x1 > offset:
                    x1 -= offset
                if y1 > offset:
                    y1 -= offset
                x2, y2 = vertices[2]
                if x2 < width - offset:
                    x2 += offset
                if y2 < height - offset:
                    y2 += offset
                draw.rectangle([x1, y1, x2, y2], outline='red', width=2)

            buffer = BytesIO()
            image.save(buffer, format='PNG')

            return b64encode(buffer.getvalue())
        except:
            return None

    def post(self):
        try:
            screenshot = request.files.get('image')
            if not screenshot:
                return {'message': 'Image is required'}, 400

            language: str = request.form.get('language', '')
            if not language:
                return {'message': 'Language is required'}, 400

            ignore_words_dict: Dict[str, List[str]] = json.loads(request.form.get('ignore_words', {}))
            ignore_words = ignore_words_dict.get(language, [])

            content = screenshot.read()
            image = vision.Image(content=content)
            response = self.__google_client.text_detection(image=image)
            if response.error.message:
                raise Exception(
                    "{}\nFor more info on error messages, check: "
                    "https://cloud.google.com/apis/design/errors".format(response.error.message)
                )

            texts = response.text_annotations
            dictionary = MultiDictionary()
            incorrect_words = []
            bounds = {}
            for text in texts:
                word = text.description.strip().lower()
                if word in ignore_words or ignore_word(word):
                    continue

                word = re.sub(r'[^\w\s$]|[\dº]', '', word)
                if not word:
                    continue

                # Classification = [Noun, Verb, Adjective, etc].
                classification, _, _ = dictionary.meaning(language, word)
                if classification and len(classification) > 0:
                    # Word is correct
                    continue

                if word not in incorrect_words:
                    incorrect_words.append(word)
                bounds[word] = [(vertex.x, vertex.y) for vertex in text.bounding_poly.vertices]

            drawn_image = self.draw_missing_words(Image.open(screenshot), bounds)

            now = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
            data = {
                'id': str(uuid4()),
                'language': language,
                'words': incorrect_words,
                'time': now,
                'image': drawn_image.decode('utf-8') if drawn_image else None,
            }
            return data, 200
        except:
            traceback.print_exc()
            return {'message': 'Internal Server Error'}, 500
