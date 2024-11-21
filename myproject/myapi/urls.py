from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path('user-csv-files/', views.user_csv_files, name='user_csv_files'),
    path('upload-csv/', views.upload_csv, name='upload_csv'),
    path('csv_files/<int:file_id>/', views.delete_csv_file, name='delete_csv_file'),
    path('graph-data/<int:file_id>/', views.get_graph_data, name='get_graph_data'),
    path('upload-graph-image/', views.upload_graph_image, name='upload_graph_image'),
    path('get-uploaded-images/', views.get_uploaded_images, name='get_uploaded_images'),
    path('update-password/', views.update_password, name='update_password'),
    path("csv_files/<int:file_id>/download/", views.download_csv, name="download_csv"),
    path("images/<int:image_id>/", views.delete_image, name="delete_image"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
