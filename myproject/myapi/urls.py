from django.urls import path
from . import views
from .views import SaveGraphImageView, UserGraphImagesView

urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    
]
