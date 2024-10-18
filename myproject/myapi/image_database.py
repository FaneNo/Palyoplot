# myproject/database.py

import mariadb
import sys


def save_graph_image(conn, user_id, image_data, metadata):
    """
    Save a graph image to the graph_images table.

    :param conn: The database connection object.
    :param user_id: The ID of the user saving the image.
    :param image_data: The binary data of the image.
    :param metadata: A dictionary containing metadata about the image.
    """
    try:
        cur = conn.cursor()
        query = "INSERT INTO graph_images (user_id, image_data, metadata) VALUES (?, ?, ?)"
        cur.execute(query, (user_id, image_data, metadata))
        conn.commit()
        print("Image saved successfully.")
    except mariadb.Error as e:
        print(f"Error saving image: {e}")
    finally:
        cur.close()
        
def get_user_images(conn, user_id):
    """
    Retrieve all graph images saved by a user.

    :param conn: The database connection object.
    :param user_id: The ID of the user.
    :return: A list of tuples containing the image data and metadata.
    """
    try:
        cur = conn.cursor()
        query = "SELECT image_data, metadata FROM graph_images WHERE user_id = ?"
        cur.execute(query, (user_id,))
        images = cur.fetchall()
        return images
    except mariadb.Error as e:
        print(f"Error retrieving images: {e}")
    finally:
        cur.close()

