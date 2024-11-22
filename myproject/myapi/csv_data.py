import csv
import mariadb
from mariadb import ConnectionPool
import os
from django.db import models, transaction # Add this line
from myapi.models import CSVFile, CsvColumn, CsvData, VisualizationPreferences  # Ensure related models are imported

connection_pool = ConnectionPool(
    pool_name=os.getenv('pool_name'),
    pool_size=int(os.getenv('pool_size')),  # Ensure pool_size is an integer
    user=os.getenv('user'),
    password=os.getenv('password'),
    database=os.getenv('database'), 
)

def get_connection():
    return connection_pool.get_connection()

def insert_csv_data(user_id, file_name, csv_data, visualization_prefs):
    csv_lines = csv_data.splitlines()
    csv_reader = csv.reader(csv_lines)
    header = next(csv_reader)  # Read the header row
    row_count = len(csv_lines) - 1  # Exclude header row

    with transaction.atomic():
        # Get the maximum display_id
        max_display_id = CSVFile.objects.aggregate(max_id=models.Max('display_id'))['max_id'] or 0

        # Create CSVFile instance
        csv_file = CSVFile.objects.create(
            user_id=user_id,
            file_name=file_name,
            row_count=row_count,
            display_id=max_display_id + 1
            # upload_date is automatically set via auto_now_add
        )

        # Insert records into the CsvColumn table
        column_ids = []
        for column_order, column_name in enumerate(header, start=1):
            column = CsvColumn.objects.create(
                file_id=csv_file.id,
                column_name=column_name,
                column_order=column_order
            )
            column_ids.append(column.id)

        # Insert data into the CsvData table
        for row_number, row in enumerate(csv_reader, start=1):
            for column_order, value in enumerate(row, start=1):
                column_id = column_ids[column_order - 1]
                CsvData.objects.create(
                    file_id=csv_file.id,
                    row_number=row_number,
                    column_id=column_id,
                    value=value
                )

        # Insert a record into the VisualizationPreferences table
        VisualizationPreferences.objects.create(
            file_id=csv_file.id,
            graph_type=visualization_prefs['graph_type'],
            color=visualization_prefs.get('color', ''),
            x_axis_column_id=column_ids[visualization_prefs['x_axis_column_index']],
            y_axis_column_id=column_ids[visualization_prefs['y_axis_column_index']],
            title=visualization_prefs.get('title', ''),
            additional_options=visualization_prefs.get('additional_options', {})
        )

    return csv_file.id, csv_file.display_id


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
            
            # Add file information to the CSV
            file_info = ['File ID', 'File Name']
            columns = file_info + columns
            with open(output_file, mode='w', newline='') as file:
                writer = csv.writer(file)
                # Write the header
                writer.writerow(columns)
                
                # Write file information and data rows
                for row_number in sorted(data.keys()):
                    row_data = [display_id, file_name] + [data[row_number].get(col, '') for col in columns[len(file_info):]]
                    writer.writerow(row_data)
    finally:
        connection.close()
        
#export without csv
def export_to_csv_no_csv(file_id, output_file):
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

            # Add file information to the CSV
            file_info = ['File ID', 'File Name']
            columns = file_info + columns
            with open(output_file, mode='w', newline='') as file:
                writer = csv.writer(file)
                # Write the header
                writer.writerow(columns)
                
                # Write file information and data rows
                for row_number in sorted(data.keys()):
                    row_data = [display_id, file_name] + [data[row_number].get(col, '') for col in columns[len(file_info):]]
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


        
def graph_data(file_id):
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
            
            # Fetch all data rows
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
            
            # Organize data into dictionary
            data = {}
            for row in rows:
                row_number, column_name, value = row
                if row_number not in data:
                    data[row_number] = {}
                data[row_number][column_name] = value
            
            # Format output string
            output = []
            
            # Add header row with quotes
            header = '","'.join([''] + columns)  # Add empty string for initial quote
            output.append(f'"{header}"')
            
            # Add data rows
            for row_num in sorted(data.keys()):
                row_values = []
                # Add row number in quotes
                row_values.append(f'"{row_num}"')
                # Add each column value
                for col in columns:
                    value = data[row_num].get(col, '')
                    row_values.append(str(value))
                output.append(','.join(row_values))
            
            # Join all rows with newlines
            return '\n'.join(output)
            
    except mariadb.Error as e:
        print(f"Error fetching data: {e}")
        return None
    finally:
        connection.close()
        