import unittest
import requests


class LLMTest(unittest.TestCase):
    base_url = "http://127.0.0.1:8000"

    def test_home(self):
        response = requests.get(self.base_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.text, "Welcome")

    def test_llm_no_user_name(self):
        response = requests.post(self.base_url + '/generate-query')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {
            "error": "Missing name in request body"
        })

    def test_llm_no_query(self):
        response = requests.post(self.base_url + '/generate-query',
                                 data={
                                     "name": "user_name"
                                 })

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {
            "error": "Missing query in request body"
        })

    def test_llm_ok_response(self):
        response = requests.post(self.base_url + '/generate-query',
                                 data={
                                     "name": "user_name",
                                     "query": "Amazon's sale 2020"
                                 })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'success': True, 'message': None, 'data': [{'entity': 'Amazon', 'parameter': 'sales', 'startDate': '2020-01-01', 'endDate': '2020-12-31'}]})


if __name__ == '__main__':
    unittest.main()
