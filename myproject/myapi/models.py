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
    image_data = models.ImageField(upload_to='images/') # Store in images directory

    def __str__(self):
        return self.title

class CSVFile(models.Model):
    id = models.AutoField(primary_key=True)
    display_id = models.IntegerField(null=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id', related_name='csv_files', default=1)
    file_name = models.CharField(max_length=255)
    upload_date = models.DateTimeField(auto_now_add=True)
    row_count = models.IntegerField(null=True)

    class Meta:
        db_table = 'csv_files'
        indexes = [
            models.Index(fields=['user_id'], name='user_id_idx')
        ]

    def __str__(self):
        return self.file_name

class CSVColumn(models.Model):
    id = models.AutoField(primary_key=True)
    file_id = models.ForeignKey('CSVFile', on_delete=models.CASCADE, db_column='file_id', related_name='columns', default=1)
    column_name = models.CharField(max_length=255)
    column_order = models.IntegerField(default=0)
    data_type = models.CharField(max_length=50, null=True)

    class Meta:
        db_table = 'csv_columns'
        indexes = [
            models.Index(fields=['file_id'], name='file_id_idx_csvcolumn')
        ]

class CSVData(models.Model):
    id = models.AutoField(primary_key=True)
    file_id = models.ForeignKey('CSVFile', on_delete=models.CASCADE, db_column='file_id', related_name='data', default=1)
    row_number = models.IntegerField()
    column_id = models.ForeignKey('CSVColumn', on_delete=models.CASCADE, db_column='column_id', related_name='data', default=1)
    value = models.TextField(null=True)

    class Meta:
        db_table = 'csv_data'
        indexes = [
            models.Index(fields=['file_id'], name='file_id_idx_csvdata'),
            models.Index(fields=['column_id'], name='column_id_idx_csvdata')
        ]

class VisualizationPreference(models.Model):
    id = models.AutoField(primary_key=True)
    file_id = models.ForeignKey('CSVFile', on_delete=models.CASCADE, db_column='file_id', related_name='visualization_preferences', null=True)
    graph_type = models.CharField(max_length=50, default='bar')
    color = models.CharField(max_length=50, null=True)
    x_axis_column_id = models.ForeignKey('CSVColumn', on_delete=models.CASCADE, db_column='x_axis_column_id', related_name='x_axis_visualizations', null=True)
    y_axis_column_id = models.ForeignKey('CSVColumn', on_delete=models.CASCADE, db_column='y_axis_column_id', related_name='y_axis_visualizations', null=True)
    title = models.CharField(max_length=50, null=True)
    additional_options = models.JSONField(null=True)

    class Meta:
        db_table = 'visualization_preferences'
        indexes = [
            models.Index(fields=['file_id'], name='file_id_idx'),
            models.Index(fields=['x_axis_column_id'], name='x_axis_col_idx'),
            models.Index(fields=['y_axis_column_id'], name='y_axis_col_idx')
        ]

class GraphImage(models.Model):
    image_id = models.AutoField(primary_key=True, default=1)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id', related_name='graph_images', default=1)
    image_data = models.BinaryField(default=b'')
    metadata = models.TextField(null=True)

    class Meta:
        db_table = 'graph_images'