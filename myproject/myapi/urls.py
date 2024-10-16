from django.urls import path
from . import views


urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    path('user-csv-files/', views.user_csv_files, name='user_csv_files'),
    
]
