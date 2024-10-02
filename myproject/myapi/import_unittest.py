import unittest
import mariadb
import json
from image_database import get_user_images, save_graph_image

class TestSaveGraphImage(unittest.TestCase):
    def test_save_graph_image(self):
        conn = mariadb.connect(
            user="csc190191",
            password="123",
            host="localhost",
            database="palyoplot"
        )  # Set up your database connection here
        user_id = 1  # Use a test user_id
        image_data = b"test_image_data"  # Use some test image data
        metadata = {
            'created_at': '2021-01-01',
            'graph_type': 'bar',
            'description': 'Test image'
            }  # Use some test metadata

        save_graph_image(conn, user_id, image_data, json.dumps(metadata))

        # Now retrieve the image from the database and verify that it was saved correctly
        # You can use the `get_user_images` function for this
        images = get_user_images(conn, user_id)
        self.assertEqual(len(images), 1)
        self.assertEqual(images[0][0], image_data)
        self.assertEqual(images[0][1], json.dumps(metadata))

if __name__ == '__main__':
    unittest.main()