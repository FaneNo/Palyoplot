# myproject/database.py

import mariadb
import sys

# def database():
#     # Instantiate Connection
#     try:
#         conn = mariadb.connect(
#             user="csc190191",
#             password="123"
#         )
#         conn.auto_reconnect = True
#         print("Connection to MariaDB Platform successful")
        
#         cur = conn.cursor()
#         test_user = "test_user"
#         test_password = "test_password"
        
#         # Drop the test user if it already exists
#         try:
#             cur.execute(f"DROP USER IF EXISTS '{test_user}'@'localhost'")
#             print(f"Test user '{test_user}' dropped successfully (if it existed)")
#         except mariadb.Error as e:
#             print(f"Error dropping test user: {e}")

#         # Create the test user
#         try:
#             cur.execute(f"CREATE USER '{test_user}'@'localhost' IDENTIFIED BY '{test_password}'")
#             cur.execute(f"GRANT ALL PRIVILEGES ON *.* TO '{test_user}'@'localhost' WITH GRANT OPTION")
#             cur.execute("FLUSH PRIVILEGES")
#             print(f"Test user '{test_user}' created successfully")
#         except mariadb.Error as e:
#             print(f"Error creating test user: {e}")

#         try:
#             cur.execute("CREATE DATABASE IF NOT EXISTS test_db")
#             print("Database 'test_db' created successfully")
#         except mariadb.Error as e:
#             print(f"Error creating database: {e}")
#         # Show databases
#         cur.execute("SHOW DATABASES")
#         print("Databases available:")
#         for (database,) in cur:
#             print(database)
#         try:
#             cur.execute("DROP DATABASE test_db")
#             print("Database 'test_db' dropped successfully")
#         except mariadb.Error as e:
#             print(f"Error dropping database: {e}")
#     except mariadb.Error as e:
#         print(f"Error connecting to the database: {e}")
#         sys.exit(1)
#     finally:
#         # Close Connection
#         conn.close()


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

