from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
import mariadb

# Create your views here.
@api_view(['GET'])
#this code create a new API endpoint that returns a JSON response with the message "Hello, world"
def hello_world(request):
    return Response({'message': 'This is part of the myproject/api/views'})

#create method for each function
#Look in Serializer documentation for Django or video
#for example if you want to delete a graph create a deleteGraph method here

#enable us to create new user
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer #tell this view what kind of data that need to be accept to create a new user
    permission_classes = [AllowAny] #who can call this function
    

