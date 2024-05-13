import os
import json
import traceback
from typing import Dict, List
from flask_restful import Resource, request
from google.cloud import vision
from google.oauth2 import service_account


class Check(Resource):
    def __init__(self, *args, **kwargs) -> None:
        service_account_info = json.loads(os.getenv('GOOGLE_CREDENTIALS'))
        credentials = service_account.Credentials.from_service_account_info(service_account_info)
        self.__google_client: vision.ImageAnnotatorClient = vision.ImageAnnotatorClient(credentials=credentials)
        super().__init__(*args, **kwargs)

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
            texts = response.text_annotations
            print("Texts:")

            for text in texts:
                print(f'\n"{text.description}"')

                vertices = [f"({vertex.x},{vertex.y})" for vertex in text.bounding_poly.vertices]

                print("bounds: {}".format(",".join(vertices)))

            if response.error.message:
                raise Exception(
                    "{}\nFor more info on error messages, check: "
                    "https://cloud.google.com/apis/design/errors".format(response.error.message)
                )

            return {'message': 'success'}, 200
        except:
            traceback.print_exc()
            return {'message': 'error'}, 500
