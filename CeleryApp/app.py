"""
Celery Task Queue Application
"""
from flask import Flask, jsonify
from celery import Celery
import celery

app = Flask(__name__)

celery_app = Celery(
    'tasks',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)

@celery_app.task
def add_numbers(x, y):
    """Simple task that adds two numbers"""
    return x + y

@app.route('/')
def home():
    return jsonify({
        'message': 'Celery Task Queue App',
        'celery_version': celery.__version__,
        'python_version': '3.8'
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'}), 200

@app.route('/version')
def version():
    celery_ver = celery.__version__
    is_vulnerable = celery_ver.startswith('5.3')

    return jsonify({
        'celery': celery_ver,
        'status': 'VULNERABLE' if is_vulnerable else 'Fixed'
    })

@app.route('/task/add/<int:x>/<int:y>')
def create_task(x, y):
    """Create an async task"""
    result = add_numbers.delay(x, y)
    return jsonify({
        'task_id': result.id,
        'status': 'Task queued'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

