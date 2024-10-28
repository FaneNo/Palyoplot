import datetime
from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, CSVFileSer
from .models import CSVFile, Dataset
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response


from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from .csv_data import insert_csv_data, delete_csv
from rest_framework import status

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_csv_files(request):
    user = request.user
    csv_files = CSVFile.objects.filter(user=user)
    serializer = CSVFileSer(csv_files, many=True)
    return Response(serializer.data)


#create method for each function
#Look in Serializer documentation for Django or video
#for example if you want to delete a graph create a deleteGraph method here

#Upload a CSV file
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_csv(request):
    user = request.user
    csv_file = request.FILES.get('csv_file')
    
    if not csv_file:
        return Response({'error': 'No file provided'}, status=400)

    file_name = csv_file.name

    
    csv_data = csv_file.read().decode('utf-8')
    
    # Default visualization preferences 
    visualization_prefs = {
        "graph_type": "bar",
        "color": "blue",
        "x_axis_column_index": 0,  
        "y_axis_column_index": 1,  
        "title": "Example Graph",
        "additional_options": '{"Stuff": "Example Stuff"}'
    }

    # Insert CSV data into your database
    insert_csv_data(user.id, file_name, csv_data, visualization_prefs)

    return Response({'message': 'File uploaded and data inserted successfully'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_csv_file(request, file_id):
    try:
        # First, check if the file exists and belongs to the user
        csv_file = CSVFile.objects.get(id=file_id, user=request.user)
        
       
        delete_csv(file_id)
        
        return Response({'message': 'File deleted successfully and display IDs resequenced'}, 
                        status=status.HTTP_204_NO_CONTENT)
    
    except CSVFile.DoesNotExist:
        return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#enable us to create new user
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer #tell this view what kind of data that need to be accept to create a new user
    permission_classes = [AllowAny] #who can call this function

# Save graph image
def save_graph_image(request):
    user = request.user
    dataset_id = request.data.get('dataset_id')
    image_data = request.data.get('image')
    dataset = get_object_or_404(Dataset)

    if image_data:
        dataset.image = image_data
        dataset.save()
        return Response({'message': 'Graph image saved successfully'}, status=status.HTTP_200_OK)
    return Response({'error': 'No image data found'}, status=status.HTTP_400_BAD_REQUEST)
    

