import time
import data_util
import os
from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app, support_credentials=True)


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/api/data/<key>')
@cross_origin(supports_credentials=True)
def get_data(key):
    return {'data': data_util.get_data(key), 'key': key}

if __name__ == '__main__':
    app.run(port=8080)