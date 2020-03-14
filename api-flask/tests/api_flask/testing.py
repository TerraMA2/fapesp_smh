from api_flask import app as app
from json import loads as json_loads
from jsonschema import validate
import unittest

app = app.test_client()

class Test(unittest.TestCase):
    def test_connection(self):
        resp = app.get('/')
        self.assertEqual(200, resp.status_code)