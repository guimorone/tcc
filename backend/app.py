from flask import Flask
from flask_cors import CORS
from flask_restful import Api

app = Flask(__name__)
CORS(app)
api = Api(app)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
