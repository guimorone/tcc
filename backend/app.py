from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from dotenv import load_dotenv

# Resources
from resources.check import Check

load_dotenv('.env')

app = Flask(__name__)
CORS(app)
api = Api(app)

api.add_resource(Check, '/check/<request_type>', methods=['POST'])

if __name__ == '__main__':
    app.run(port=5000, debug=True)
