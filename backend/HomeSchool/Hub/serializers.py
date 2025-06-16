from rest_framework import serializers
from .models import *

class PrincipalLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Principallogin
        fields = ["EmailName", "Password"]
class StudentTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentTable
        fields = ["RegNumber", "Password"]

class TeacherTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherTable
        fields = ["TeacherNumber", "Password"]