from django.urls import path
from . import views
from .views import home, RegisterView


urlpatterns = [
    path('user-csv-files/', views.user_csv_files, name='user_csv_files'),
    path('upload-csv/', views.upload_csv, name='upload_csv'),
    path('csv_files/<int:file_id>/', views.delete_csv_file, name='delete_csv_file'),
    path('graph-data/<int:file_id>/', views.get_graph_data, name='get_graph_data'),
    path('upload-graph-image/', views.upload_graph_image, name='upload_graph_image'),
    path('', home, name='users-home'),
    path('register/', RegisterView.as_view(), name='users-register'),
]
