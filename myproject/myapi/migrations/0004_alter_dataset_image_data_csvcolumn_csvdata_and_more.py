# Generated by Django 5.1.3 on 2024-11-13 07:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapi', '0003_alter_csvfile_upload_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dataset',
            name='image_data',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
        migrations.CreateModel(
            name='CsvColumn',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('column_name', models.CharField(max_length=255)),
                ('column_order', models.IntegerField()),
                ('file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='columns', to='myapi.csvfile')),
            ],
            options={
                'db_table': 'csv_columns',
            },
        ),
        migrations.CreateModel(
            name='CsvData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('row_number', models.IntegerField()),
                ('value', models.TextField()),
                ('column', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='data', to='myapi.csvcolumn')),
                ('file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='data', to='myapi.csvfile')),
            ],
            options={
                'db_table': 'csv_data',
            },
        ),
        migrations.CreateModel(
            name='VisualizationPreferences',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('graph_type', models.CharField(max_length=50)),
                ('color', models.CharField(max_length=50)),
                ('title', models.CharField(max_length=255)),
                ('additional_options', models.JSONField(blank=True, null=True)),
                ('file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='visualization_prefs', to='myapi.csvfile')),
                ('x_axis_column', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='x_axis_visualizations', to='myapi.csvcolumn')),
                ('y_axis_column', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='y_axis_visualizations', to='myapi.csvcolumn')),
            ],
            options={
                'db_table': 'visualization_preferences',
            },
        ),
    ]
