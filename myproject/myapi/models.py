from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Dataset(models.Model):
    # Tracking user that uploaded the dataset
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='datasets')

    # Name of the dataset
    filename = models.TextField()

    # Tracks dataset type according to NeotomaDB (insect, pollen, etc)
    dataset_type = models.CharField(max_length=50)

    # Store CSV data and visualization preferences in JSON
    csv_data = models.JSONField(null=True, blank=True)
    visualization_pref = models.JSONField(null=True, blank=True)

    # Timestamps for when dataset is created and updated
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Image data
    image_data = models.ImageField(upload_to='images/', null=True, blank=True)  # Option 2

    def __str__(self):
        return self.filename  # Corrected


class CSVFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    upload_date = models.DateTimeField(auto_now_add=True)
    row_count = models.IntegerField()
    display_id = models.IntegerField()

    class Meta:
        db_table = 'csv_files'

    def __str__(self):
        return self.file_name


class CsvColumn(models.Model):
    file = models.ForeignKey(CSVFile, on_delete=models.CASCADE, related_name='columns')
    column_name = models.CharField(max_length=255)
    column_order = models.IntegerField()
    data_type = models.CharField(max_length=50, null=True, blank=True)  # Optional field

    class Meta:
        db_table = 'csv_columns'

    def __str__(self):
        return self.column_name


class CsvData(models.Model):
    file = models.ForeignKey(CSVFile, on_delete=models.CASCADE, related_name='data')
    row_number = models.IntegerField()
    column = models.ForeignKey(CsvColumn, on_delete=models.CASCADE, related_name='data')
    value = models.TextField()

    class Meta:
        db_table = 'csv_data'

    def __str__(self):
        return f"Row {self.row_number}, Column {self.column.column_name}"


class VisualizationPreferences(models.Model):
    file = models.ForeignKey(CSVFile, on_delete=models.CASCADE, related_name='visualization_prefs')
    graph_type = models.CharField(max_length=50)
    color = models.CharField(max_length=50, null=True, blank=True)
    x_axis_column = models.ForeignKey(CsvColumn, on_delete=models.CASCADE, related_name='x_axis_visualizations')
    y_axis_column = models.ForeignKey(CsvColumn, on_delete=models.CASCADE, related_name='y_axis_visualizations')
    title = models.CharField(max_length=255)
    additional_options = models.JSONField(null=True, blank=True)

    class Meta:
        db_table = 'visualization_preferences'

    def __str__(self):
        return self.title


class GraphImage(models.Model):
    image_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image_data = models.ImageField(upload_to='graph_images/')
    metadata = models.TextField()

    class Meta:
        db_table = 'graph_images'

    def __str__(self):
        return f"GraphImage {self.image_id} for User {self.user.id}"