from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
@api_view(['GET'])
#this code create a new API endpoint that returns a JSON response with the message "Hello, world"
def hello_world(request):
    return Response({'message': 'This is part of the myproject/api/views'})