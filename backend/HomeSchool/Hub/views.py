from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import PrincipalLoginSerializer, StudentTableSerializer, TeacherTableSerializer

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

# Create your views here.
