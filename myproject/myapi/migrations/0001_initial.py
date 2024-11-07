# Generated by Django 5.0.4 on 2024-11-07 09:05

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CSVFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_name', models.CharField(max_length=255)),
                ('upload_date', models.DateTimeField()),
                ('row_count', models.IntegerField()),
                ('display_id', models.IntegerField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'csv_files',
            },
        ),
        migrations.CreateModel(
            name='Dataset',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('filename', models.TextField()),
                ('dataset_type', models.CharField(max_length=50)),
                ('csv_data', models.JSONField(blank=True, null=True)),
                ('visualization_pref', models.JSONField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('image_data', models.ImageField(upload_to='images/')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='datasets', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]