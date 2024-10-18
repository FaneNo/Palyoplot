import csv
import mariadb
from mariadb.connectionpool import ConnectionPool

connection_pool = ConnectionPool(
    pool_name="mypool",
    pool_size=5,
    user="csc190191",
    password="123",
    database="palyoplot"   
)

def get_connection():
    return connection_pool.get_connection()
# def insert_csv_data(user_id, file_name, csv_data, visualization_prefs):
#     connection = mariadb.connect(
#         user="csc190191",
#         password="123",
#         database="palyoplot"
#     )
#     try:
#         with connection.cursor() as cursor:
#             # Insert a record into the csv_files table
#             sql_insert_file = "INSERT INTO csv_files (user_id, file_name, row_count) VALUES (?, ?, ?)"
#             row_count = len(csv_data.splitlines()) - 1  # Exclude header row
#             cursor.execute(sql_insert_file, (user_id, file_name, row_count))
            
#             #Retrieve the file_id of the newly inserted record
#             file_id = cursor.lastrowid
            
#             # Insert records into the csv_columns table for each column in the CSV
#             csv_reader = csv.reader(csv_data.splitlines())
#             header = next(csv_reader)  # Read the header row
#             column_ids = []
#             for column_order, column_name in enumerate(header, start=1):
#                 sql_insert_column = "INSERT INTO csv_columns (file_id, column_name, column_order) VALUES (?, ?, ?)"
#                 cursor.execute(sql_insert_column, (file_id, column_name, column_order))
#                 column_ids.append(cursor.lastrowid)
            
#             # Insert data into the csv_data table
#             for row_number, row in enumerate(csv_reader, start=1):
#                 for column_order, value in enumerate(row, start=1):
#                     column_id = column_ids[column_order - 1]
#                     sql_insert_data = "INSERT INTO csv_data (file_id, row_number, column_id, value) VALUES (?, ?, ?, ?)"
#                     cursor.execute(sql_insert_data, (file_id, row_number, column_id, value))
            
#             #Insert a record into the visualization_preferences table
#             sql_insert_viz_prefs = """
#                 INSERT INTO visualization_preferences 
#                 (file_id, graph_type, color, x_axis_column_id, y_axis_column_id,title, additional_options) 
#                 VALUES (?, ?, ?, ?, ?, ?, ?)
#             """
#             cursor.execute(sql_insert_viz_prefs, (
#                 file_id, 
#                 visualization_prefs['graph_type'], 
#                 visualization_prefs['color'], 
#                 column_ids[visualization_prefs['x_axis_column_index']], 
#                 column_ids[visualization_prefs['y_axis_column_index']],
#                 visualization_prefs['title'], 
#                 visualization_prefs['additional_options']
#             ))
    
#         connection.commit()
    
#     finally:
#         connection.close()
    


# def export_to_csv(file_id, output_file):
#     connection = mariadb.connect(
#         user="csc190191",
#         password="123",
#         database="palyoplot"
#     )
#     try:
#         with connection.cursor() as cursor:
#             # Fetch column names for the header
#             cursor.execute("""
#                 SELECT 
#                     column_name
#                 FROM 
#                     csv_columns
#                 WHERE 
#                     file_id = ?
#                 ORDER BY 
#                     column_order;
#             """, (file_id,))
#             columns = [col[0] for col in cursor.fetchall()]
            
            # cursor.execute("""
            #     SELECT 
            #         cd.row_number,
            #         cc.column_name,
            #         cd.value
            #     FROM 
            #         csv_data cd
            #     JOIN 
            #         csv_columns cc ON cd.column_id = cc.id
            #     WHERE
            #         cd.file_id = ?
            #     ORDER BY 
            #         cd.row_number, cc.column_order;
            # """, (file_id,))
            # rows = cursor.fetchall()

            # # Organize data into rows
            # data = {}
            # for row in rows:
            #     row_number, column_name, value = row
            #     if row_number not in data:
            #         data[row_number] = {}
            #     data[row_number][column_name] = value

            # # Get visualization preferences
            # cursor.execute("""
            #     SELECT 
            #         graph_type,
            #         color,
            #         x_axis_column_id,
            #         y_axis_column_id,
            #         title,
            #         additional_options
            #     FROM 
            #         visualization_preferences
            #     WHERE 
            #         file_id = ?;
            # """, (file_id,))
            # vis_prefs = cursor.fetchall()

            # # Add visualization preferences as additional columns
            # vis_columns = ['Graph Type', 'Color', 'X Axis Column ID', 'Y Axis Column ID', 'Title', 'Additional Options']
            # columns.extend(vis_columns)

#             with open(output_file, mode='w', newline='') as file:
#                 writer = csv.writer(file)
#                 # Write the header
#                 writer.writerow(columns)
                
#                 # Write the data rows
#                 for row_number in sorted(data.keys()):
#                     row_data = [data[row_number].get(col, '') for col in columns[:-len(vis_columns)]]
#                     if vis_prefs:
#                         row_data.extend(vis_prefs[0])
#                     else:
#                         row_data.extend([''] * len(vis_columns))
#                     writer.writerow(row_data)
#     finally:
#         connection.close()


 

def insert_csv_data(user_id, file_name, csv_data, visualization_prefs):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Get the maximum display_id
            cursor.execute("SELECT COALESCE(MAX(display_id), 0) FROM csv_files")
            max_display_id = cursor.fetchone()[0]
            
            # Insert a record into the csv_files table with display_id
            sql_insert_file = "INSERT INTO csv_files (user_id, file_name, row_count, display_id) VALUES (?, ?, ?, ?)"
            row_count = len(csv_data.splitlines()) - 1  # Exclude header row
            cursor.execute(sql_insert_file, (user_id, file_name, row_count, max_display_id + 1))
            
            # Retrieve the file_id of the newly inserted record
            file_id = cursor.lastrowid
            
            # Insert records into the csv_columns table for each column in the CSV
            csv_reader = csv.reader(csv_data.splitlines())
            header = next(csv_reader)  # Read the header row
            column_ids = []
            for column_order, column_name in enumerate(header, start=1):
                sql_insert_column = "INSERT INTO csv_columns (file_id, column_name, column_order) VALUES (?, ?, ?)"
                cursor.execute(sql_insert_column, (file_id, column_name, column_order))
                column_ids.append(cursor.lastrowid)
            
            # Insert data into the csv_data table
            for row_number, row in enumerate(csv_reader, start=1):
                for column_order, value in enumerate(row, start=1):
                    column_id = column_ids[column_order - 1]
                    sql_insert_data = "INSERT INTO csv_data (file_id, row_number, column_id, value) VALUES (?, ?, ?, ?)"
                    cursor.execute(sql_insert_data, (file_id, row_number, column_id, value))
            
            #Insert a record into the visualization_preferences table
            sql_insert_viz_prefs = """
                INSERT INTO visualization_preferences 
                (file_id, graph_type, color, x_axis_column_id, y_axis_column_id,title, additional_options) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            cursor.execute(sql_insert_viz_prefs, (
                file_id, 
                visualization_prefs['graph_type'], 
                visualization_prefs['color'], 
                column_ids[visualization_prefs['x_axis_column_index']], 
                column_ids[visualization_prefs['y_axis_column_index']],
                visualization_prefs['title'], 
                visualization_prefs['additional_options']
            ))
    

        connection.commit()
    
    finally:
        connection.close()

    return file_id, max_display_id + 1  # Return both file_id and display_id


def export_to_csv(file_id, output_file):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Fetch file information including display_id
            cursor.execute("SELECT display_id, file_name FROM csv_files WHERE id = ?", (file_id,))
            display_id, file_name = cursor.fetchone()

            # Fetch column names for the header
            cursor.execute("""
                SELECT 
                    column_name
                FROM 
                    csv_columns
                WHERE 
                    file_id = ?
                ORDER BY 
                    column_order;
            """, (file_id,))
            columns = [col[0] for col in cursor.fetchall()]
            
        
            cursor.execute("""
                SELECT 
                    cd.row_number,
                    cc.column_name,
                    cd.value
                FROM 
                    csv_data cd
                JOIN 
                    csv_columns cc ON cd.column_id = cc.id
                WHERE
                    cd.file_id = ?
                ORDER BY 
                    cd.row_number, cc.column_order;
            """, (file_id,))
            rows = cursor.fetchall()

            # Organize data into rows
            data = {}
            for row in rows:
                row_number, column_name, value = row
                if row_number not in data:
                    data[row_number] = {}
                data[row_number][column_name] = value

            # Get visualization preferences
            cursor.execute("""
                SELECT 
                    graph_type,
                    color,
                    x_axis_column_id,
                    y_axis_column_id,
                    title,
                    additional_options
                FROM 
                    visualization_preferences
                WHERE 
                    file_id = ?;
            """, (file_id,))
            vis_prefs = cursor.fetchall()

            # Add visualization preferences as additional columns
            vis_columns = ['Graph Type', 'Color', 'X Axis Column ID', 'Y Axis Column ID', 'Title', 'Additional Options']
            columns.extend(vis_columns)
            
            
            # Add file information to the CSV
            file_info = ['File ID', 'File Name']
            columns = file_info + columns
            with open(output_file, mode='w', newline='') as file:
                writer = csv.writer(file)
                # Write the header
                writer.writerow(columns)
                
                # Write file information and data rows
                for row_number in sorted(data.keys()):
                    row_data = [display_id, file_name] + [data[row_number].get(col, '') for col in columns[len(file_info):-len(vis_columns)]]
                    if vis_prefs:
                        row_data.extend(vis_prefs[0])
                    else:
                        row_data.extend([''] * len(vis_columns))
                    writer.writerow(row_data)
    finally:
        connection.close()
        
def delete_csv(file_id):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        
        connection.begin()
        
        # Get the display_id of the file to be deleted
        cursor.execute("SELECT display_id FROM csv_files WHERE id = ?", (file_id,))
        result = cursor.fetchone()
        if not result:
            raise ValueError(f"No file found with id {file_id}")
        deleted_display_id = result[0]
        print(f"Deleting file with display_id {deleted_display_id}")
        
        # Delete data from visualization_preferences table first
        cursor.execute("DELETE FROM visualization_preferences WHERE file_id = ?", (file_id,))
        
        # Delete data from csv_data table second
        cursor.execute("DELETE FROM csv_data WHERE file_id = ?", (file_id,))
        
        # Delete data from csv_columns table third
        cursor.execute("DELETE FROM csv_columns WHERE file_id = ?", (file_id,))
        
        # Delete data from csv_files table last
        cursor.execute("DELETE FROM csv_files WHERE id = ?", (file_id,))
        
        # Resequence display_ids for remaining files
        cursor.execute("""
            UPDATE csv_files
            SET display_id = display_id - 1
            WHERE display_id > ?
        """, (deleted_display_id,))
        
        
        connection.commit()
        print(f"Successfully deleted CSV file with ID {file_id} and resequenced display IDs {deleted_display_id}")
        
    except mariadb.Error as e:
        print(f"Error deleting data: {e}")
        connection.rollback()
    finally:
        connection.close()


        
        
        