from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    filename = models.TextField()
    csv_data = models.DateTimeField(auto_now_add=True)
    visualization_pref = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title

class CSVFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    upload_date = models.DateTimeField()
    row_count = models.IntegerField()

    class Meta:
        db_table = 'csv_files'

    def __str__(self):
        return self.file_name

