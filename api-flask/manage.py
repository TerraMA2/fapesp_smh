import contextlib
import os
from pathlib import Path
from api_flask.controller import app
from flask_script import Manager

manager = Manager(app)

@contextlib.contextmanager
def working_directory(path):
    """Changes working directory and returns to previous on exit."""
    owd = os.getcwd()
    print(path)
    try:
        os.chdir(path)
        yield path
    finally:
        os.chdir(owd)

@manager.command
def run(port_number):
    host = os.environ.get('SERVER_HOST', '0.0.0.0')
    try:
        port = int(os.environ.get('PORT', str(port_number)))
    except ValueError:
        port = 5000

    app.run(host, port, debug=True)

if __name__ == '__main__':
    manager.run()