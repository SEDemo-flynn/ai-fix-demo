"""
Celery Task Queue Application
"""
from flask import Flask, jsonify
from celery import Celery
import celery
from kombu import Connection
from billiard import Pool
import kombu
import billiard

import sys, platform
import celery as _celery_pkg
import kombu as _kombu_pkg
import billiard as _billiard_pkg

def _fail_version(msg: str):
    raise RuntimeError(
        f"[VersionGuard] {msg}\n"
        f"Update/remove this guard when upgrading package versions."
    )

# Lock to your current, pre-upgrade environment.
# Any upgrade will trigger a startup failure until you update these pins.
_REQUIRED = {
    "python_major_minor": (3, 8),   # Python 3.8.x only
    "celery":   "5.3.0",
    "kombu":    "5.2.4",
    "billiard": "3.6.4",
}

# Python check (major.minor)
_py_mm = (sys.version_info.major, sys.version_info.minor)
if _py_mm != _REQUIRED["python_major_minor"]:
    _fail_version(
        f"Python {platform.python_version()} detected, "
        f"required Python {_REQUIRED['python_major_minor'][0]}.{_REQUIRED['python_major_minor'][1]}"
    )

# Package exact version checks
if _celery_pkg.__version__ != _REQUIRED["celery"]:
    _fail_version(f"celery=={_celery_pkg.__version__} found; required celery=={_REQUIRED['celery']}")
if _kombu_pkg.__version__ != _REQUIRED["kombu"]:
    _fail_version(f"kombu=={_kombu_pkg.__version__} found; required kombu=={_REQUIRED['kombu']}")
if _billiard_pkg.__version__ != _REQUIRED["billiard"]:
    _fail_version(f"billiard=={_billiard_pkg.__version__} found; required billiard=={_REQUIRED['billiard']}")


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
        'kombu_version': kombu.__version__,
        'billiard_version': billiard.__version__,
        'python_version': '3.8'
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'}), 200

@app.route('/version')
def version():
    return jsonify({
        'celery': celery.__version__,
        'kombu': kombu.__version__,
        'billiard': billiard.__version__,
        'python': '3.8'
    })

@app.route('/task/add/<int:x>/<int:y>')
def create_task(x, y):
    """Create an async task"""
    result = add_numbers.delay(x, y)
    return jsonify({
        'task_id': result.id,
        'status': 'Task queued'
    })

@app.route('/queue/inspect')
def inspect_queue():
    """Inspect message queue using kombu"""
    try:
        with Connection('redis://localhost:6379/0') as conn:
            # Get queue information
            queue_name = 'celery'
            bound_queue = conn.SimpleQueue(queue_name)
            queue_size = bound_queue.qsize()
            bound_queue.close()

            return jsonify({
                'queue': queue_name,
                'size': queue_size,
                'connection': 'active',
                'kombu_version': kombu.__version__
            })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'kombu_version': kombu.__version__
        }), 500

@app.route('/workers/info')
def workers_info():
    """Get worker pool information using billiard"""
    try:
        # Demonstrate billiard usage
        def sample_task(n):
            return n * n

        with Pool(processes=2) as pool:
            results = pool.map(sample_task, [1, 2, 3, 4])

        return jsonify({
            'worker_pool': 'billiard',
            'processes': 2,
            'sample_results': results,
            'billiard_version': billiard.__version__
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'billiard_version': billiard.__version__
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

