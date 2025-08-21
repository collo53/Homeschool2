from rest_framework import serializers
from .models import *

class PrincipalLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Principallogin
        fields = ["EmailName", "Password"]
class StudentTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentTable
        fields = '__all__'  

class TeacherTableSerializer(serializers.ModelSerializer):
    students = serializers.SerializerMethodField() 

    class Meta:
        model = TeacherDetails
        fields = '__all__'  

    def get_students(self, obj):
        return [s.name for s in obj.students.all()]  

class CourseTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseTable
        fields = '__all__'  

class EventTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTable
        fields = ["Title", "Date", "Time", "Location", "Type"]
        
class MessageTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageTable
        fields = ["Sender", "Receiver", "Subject", "Message", "DateSent", "Status"]

class AssignedStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'