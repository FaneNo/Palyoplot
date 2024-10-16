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

    def __str__(self):
        return self.title


