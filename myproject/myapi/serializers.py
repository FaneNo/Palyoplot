from django.contrib.auth.models import User
from rest_framework import serializers
from .models import CSVFile 



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username","email", "password"]
        extra_kwargs = {"password": {"write_only": True}} #no one will able to read what the password is

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
    
# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ["id", "filename", "csv_data", "visualization_pref"]

class CSVFileSer(serializers.ModelSerializer):
    class Meta:
        model = CSVFile
        fields = ["id", "file_name", "upload_date", "row_count"]




 