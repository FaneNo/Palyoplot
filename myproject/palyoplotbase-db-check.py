import mysql.connector
from mysql.connector import Error

def check_connection(host, database, user, password):
    try:
        # Establish the connection
        connection = mysql.connector.connect(
            host=host,
            database=database,
            user=user,
            password=password
        )

        if connection.is_connected():
            print("Connection to MySQL database was successful!")
            db_info = connection.get_server_info()
            print("MySQL Server version:", db_info)
            return True
    except Error as e:
        print("Error while connecting to MySQL:", e)
        return False
    finally:
        # Close the connection
        if connection.is_connected():
            connection.close()
            print("MySQL connection is closed.")

# Replace the following variables with your own database credentials
host = 'ecs-pd-proj-db.ecs.csus.edu'
database = 'palyoplotbase'
user = 'pbuser'
password = 'ecs.open.pb.2024'

if __name__ == "__main__":
    check_connection(host, database, user, password)