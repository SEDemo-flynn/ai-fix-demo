"""
Simple Python Flask application
Demonstrates Pillow vulnerability that requires base image upgrade
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
    pillow_ver = PIL.__version__
    is_vulnerable = pillow_ver.startswith('9.')

    return jsonify({
        'pillow': pillow_ver,
        'status': 'VULNERABLE - Multiple CVEs' if is_vulnerable else 'Fixed',
        'note': 'Pillow 10.0+ (fixed) requires Python 3.8+, but this image uses Python 3.7'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

