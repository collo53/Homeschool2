from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import PrincipalLoginSerializer, StudentTableSerializer, TeacherTableSerializer,CourseTableSerializer,EventTableSerializer


class PrincipalLogin(APIView):
    def post(self, request):
        serializer = PrincipalLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['EmailName']
            password = serializer.validated_data['Password']
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
            

class StudentLogin(APIView):
    def post(self, request):
        serializer= StudentTableSerializer(data=request.data)
        if serializer.is_valid():
            reg_number = serializer.validated_data['RegNumber']
            password = serializer.validated_data['Password']
            serializer.save()
            return Response({"message": "User login successfully"}, status=status.HTTP_201_CREATED)

class TeacherLogin(APIView):
    def post(self, request):
        serializer= TeacherTableSerializer(data=request.data)
        if serializer.is_valid():
            teacher_number = serializer.validated_data['TeacherNumber']
            password = serializer.validated_data['Password']
            serializer.save()
            return Response({"message": "User login successfully"}, status=status.HTTP_201_CREATED)
 
class AddTeacher(APIView):
    def post(self, request):
        serializer = TeacherTableSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetTeachers(APIView):
    def get(self, request):
        teachers = TeacherDetails.objects.all()
        serializer = TeacherTableSerializer(teachers, many=True)
        return Response(serializer.data)

@api_view(['POST'])
def AddStudent(request):
    serializer = StudentTableSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Student added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
class GetStudents(APIView):
    def get(self, request):
        students = StudentTable.objects.all()
        serializer = StudentTableSerializer(students, many=True)
        return Response(serializer.data)
@api_view(['POST'])
def AddCourse(request):
    serializer = CourseTableSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Course added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def GetCourses(request):
    courses = CourseTable.objects.all()
    serializer = CourseTableSerializer(courses, many=True)
    return Response(serializer.data)
 
@api_view(['POST'])
def AddEvents(request):
    serializer = EventTableSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Course added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)  
 
@api_view(['GET'])
def GetEvents(request):
    events = EventTable.objects.all()
    serializer = EventTableSerializer(events, many=True)
    return Response(serializer.data)
# Create your views here.
