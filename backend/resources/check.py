import os
import json
import traceback
from flask_restful import Resource
from google.cloud import vision


class Check(Resource):
    def __init__(self) -> None:
        self.__google_client: vision.ImageAnnotatorClient = vision.ImageAnnotatorClient(
            credentials=json.loads(os.getenv('GOOGLE_CREDENTIALS'))
        )
        super().__init__()

    def get(self):
        try:
            return {'message': 'success'}, 200
        except:
            traceback.print_exc()
            return {'message': 'error'}, 500
