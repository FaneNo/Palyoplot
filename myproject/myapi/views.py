import base64
import datetime
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from rest_framework import generics
from .serializers import UserSerializer, CSVFileSer
from .models import CSVFile, Dataset
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from django.contrib.auth.hashers import check_password
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from .csv_data import insert_csv_data, delete_csv, graph_data
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
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_graph_data(request, file_id):
    try:
        # Check if the file exists and belongs to the user
        csv_file = CSVFile.objects.get(id=file_id, user=request.user)
        
        # Get the formatted CSV data
        csv_data = graph_data(file_id)
        
        if csv_data is None:
            return Response({'error': 'Error retrieving data'}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            'data': csv_data,
            'file_name': csv_file.file_name,
            'display_id': csv_file.display_id
        })
        
    except CSVFile.DoesNotExist:
        return Response({'error': 'File not found'}, 
                       status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@permission_classes([AllowAny]) # for testing
def upload_graph_image(request):
    image_file = request.FILES.get("image")

    if not image_file:
        return Response({"error": "No image file provided"}, status=400)
    
    # print("Received image data: ", image_data[50])
    
    # Decode base64 image
    # try: 
    #    format, imgstr = image_data.split(';base64')
    #    image_bytes = base64.b64decode(imgstr)
    #    print("Successfully decoded base64 image data")
    # except (ValueError, TypeError) as e:
    #    print("Error decoding base64 image data: ", e)
    # return Response({"error": "Invalid image data format"}, status=400)

    # Save image data to Dataset model
    dataset = Dataset.objects.create(user=request.user, image_data=image_file)
    dataset.save()

    return Response({"message": "Image uploaded successfully"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_password(request):
    user = request.user
    current_password = request.data.get('currentPassword')
    new_password = request.data.get('newPassword')
    
    # Verify current password
    if not check_password(current_password, user.password):
        return Response({
            'error': 'Current password is incorrect'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Update password
    user.set_password(new_password)
    user.save()
    
    return Response({
        'message': 'Password updated successfully'
    }, status=status.HTTP_200_OK)


#enable us to create new user
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer #tell this view what kind of data that need to be accept to create a new user
    permission_classes = [AllowAny] #who can call this function