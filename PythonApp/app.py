"""
Simple Python Flask application with image processing
"""
from flask import Flask, jsonify
import PIL
from PIL import Image

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'message': 'Hello from Python App!',
        'pillow_version': PIL.__version__,
        'python_version': '3.7'
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'}), 200

@app.route('/version')
def version():
    return jsonify({
        'pillow': PIL.__version__,
        'python': '3.7'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

