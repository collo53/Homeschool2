from rest_framework import serializers
from .models import *

class PrincipalLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Principallogin
        fields = ["EmailName", "Password"]
class StudentTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentTable
        fields = ["name", "grade", "studentNumber", "Password", "status", "courses"]

class TeacherTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherDetails
        fields = ["Name", "Email", "Phone", "ID_number", "TeacherNumber", "Password", "Unit", "Grade", "DateHired"] 

class CourseTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseTable
        fields = ["Name", "Teacher", "Students", "Schedule", "Status"]

class EventTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTable
        fields = ["Title", "Date", "Time", "Location", "Type"]
        