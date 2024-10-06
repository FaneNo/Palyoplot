import csv
import mariadb

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
    
# with open('/home/csc190191/Desktop/Palyoplot/pollen_counts.csv', 'r') as file:
#     csv_data = file.read()

# visualization_prefs = {
#     "graph_type": "bar",
#     "color": "blue",
#     "x_axis_column_index": 0,  # Index of column1
#     "y_axis_column_index": 1,  # Index of column2
#     "title": "Example Graph",
#     "additional_options": '{"Stuff": "Example Stuff"}'
# }

# insert_csv_data(1, "pollen_counts.csv", csv_data, visualization_prefs)

def export_to_csv(file_id, output_file):
    connection = mariadb.connect(
        user="csc190191",
        password="123",
        database="palyoplot"
    )
    try:
        with connection.cursor() as cursor:
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

            with open(output_file, mode='w', newline='') as file:
                writer = csv.writer(file)
                # Write the header
                writer.writerow(columns)
                
                # Write the data rows
                for row_number in sorted(data.keys()):
                    row_data = [data[row_number].get(col, '') for col in columns[:-len(vis_columns)]]
                    if vis_prefs:
                        row_data.extend(vis_prefs[0])
                    else:
                        row_data.extend([''] * len(vis_columns))
                    writer.writerow(row_data)
    finally:
        connection.close()

export_to_csv(1, "myproject/output.csv")


