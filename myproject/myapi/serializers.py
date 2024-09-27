from django.contrib.auth.models import User
from rest_framework import serializers



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username","email", "password"]
        extra_kwargs = {"password": {"write_only": True}} #no one will able to read what the password is

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user

#create the method for graphing here
#make sure to create model, view



 