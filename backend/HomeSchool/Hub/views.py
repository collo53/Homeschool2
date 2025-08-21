from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404 
import json
from django.views import View
from .models import *
from .serializers import PrincipalLoginSerializer, StudentTableSerializer, TeacherTableSerializer,CourseTableSerializer,EventTableSerializer, MessageTableSerializer,AssignedStudentSerializer,AssignmentSerializer, ActivityLogSerializer
from django.contrib.auth.hashers import make_password,check_password
from django.db.models import Q
from django.http import JsonResponse ,Http404
from django.contrib.auth import authenticate
from django.contrib.auth import authenticate, get_user_model


User = get_user_model()

class PrincipalLogin(APIView):
    def post(self, request):
        email = request.data.get("Email")
        password = request.data.get("Password")

        if not email or not password:
            return Response({"message": "Missing credentials"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

        # Authenticate still needs username internally
        user = authenticate(request, username=user_obj.username, password=password)

        if user is not None and user.is_superuser:
            return Response({
                "message": "Login successful",
                "user": {
                    "username": user.username,
                    "email": user.email
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
class StudentLogin(APIView):
    def post(self, request):
        student_number = request.data.get("studentNumber")
        password = request.data.get("Password")

        if not student_number or not password:
            return Response({"message": "Missing credentials"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = StudentTable.objects.get(studentNumber=student_number)

            if not check_password(password, student.Password):
                log_activity(user=student.name, action="Failed login attempt")
                return Response({"message": "Invalid student number or password"}, status=status.HTTP_401_UNAUTHORIZED)

            serialized_student = StudentTableSerializer(student)
            log_activity(user=student.name, action="Student logged in successfully")

            return Response({
                "message": "Login successful",
                "student": serialized_student.data
            }, status=status.HTTP_200_OK)

        except StudentTable.DoesNotExist:
            log_activity(user="Unknown Student", action=f"Failed login attempt: {student_number}")
            return Response({"message": "Invalid student number or password"}, status=status.HTTP_401_UNAUTHORIZED)

class TeacherLogin(APIView):
    def post(self, request):
        teacher_number = request.data.get("TeacherNumber")
        password = request.data.get("Password")

        if not teacher_number or not password:
            return Response({"message": "Missing credentials"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            teacher = TeacherDetails.objects.get(TeacherNumber=teacher_number)

            if not check_password(password, teacher.Password):
                log_activity(user=teacher.Name, action="Failed login attempt")
                return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

            serialized_teacher = TeacherTableSerializer(teacher)
            log_activity(user=teacher.Name, action="Teacher logged in successfully")

            return Response({
                "message": "Login successful",
                "teacher": serialized_teacher.data
            }, status=status.HTTP_200_OK)

        except TeacherDetails.DoesNotExist:
            log_activity(user="Unknown Teacher", action=f"Failed login attempt: {teacher_number}")
            return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class AddTeacher(APIView):
    def post(self, request):
        data = request.data.copy()

        if "Password" in data:
            data["Password"] = make_password(data["Password"])

        serializer = TeacherTableSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            log_activity(user="System", action="Teacher added to system")

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)  

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetTeachers(APIView):
    def get(self, request):
        teachers = TeacherDetails.objects.all()
        serializer = TeacherTableSerializer(teachers, many=True)


        return Response(serializer.data)

@api_view(['POST'])
def AddStudent(request):
    data = request.data.copy()

    if "Password" in data and data["Password"]:
        data["Password"] = make_password(data["Password"])

    serializer = StudentTableSerializer(data=data)
    if serializer.is_valid():
        serializer.save()  # don't pass password separately, it's already in `data`
        log_activity(user="System", action="Student added to system")
        return Response({
            "message": "Student added successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    return Response({
        "message": "Invalid data",
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


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
        log_activity(user="System", action="Course added to system")
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
        log_activity(user="System", action="Event added to system")
        return Response({"message": "Course added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)  
 
@api_view(['GET'])
def GetEvents(request):
    events = EventTable.objects.all()
    serializer = EventTableSerializer(events, many=True)
    return Response(serializer.data)
@api_view(['POST'])
def AddMessage(request):
    serializer = MessageTableSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        log_activity(user="System", action="Message added to system")
        return Response({"message": "Message sent successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
    print("Serializer errors:", serializer.errors)

    return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def GetMessages(request):
    messages = MessageTable.objects.all().order_by('-DateSent')
    serializer = MessageTableSerializer(messages, many=True)
    return Response(serializer.data)

class UpdateEmail(APIView):
    def post(self, request):
        old_email = request.data.get("old_email")
        new_email = request.data.get("new_email")

        if not old_email or not new_email:
            return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=old_email)
            user.email = new_email
            user.username = new_email  # ✅ important: keep username in sync with email
            user.save()
            return Response({"message": "Email updated successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Old email not found"}, status=status.HTTP_404_NOT_FOUND)


@method_decorator(csrf_exempt, name='dispatch')
class UpdatePassword(APIView):
    def post(self, request):
        email = request.data.get("email")
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not email or not current_password or not new_password:
            return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            if not user.check_password(current_password):
                return Response({"error": "Invalid current password"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
   

@api_view(['GET'])
def GetTeacherCoursesById(request, teacher_id):
    try:
        teacher = TeacherDetails.objects.get(id=teacher_id)
        courses = CourseTable.objects.filter(Teacher=teacher)  
        serializer = CourseTableSerializer(courses, many=True)

        return Response({
            "teacher": teacher.Name,
            "courses": serializer.data
        }, status=status.HTTP_200_OK)

    except TeacherDetails.DoesNotExist:
        return Response({"message": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def assign_students(request):
    print("Received data:", request.data)
    teacher_id = request.data.get("teacher_id")
    student_names = request.data.get("students", [])

    try:
        teacher = TeacherDetails.objects.get(id=teacher_id)
        Student.objects.filter(teacher=teacher).delete()
        for name in student_names:
            Student.objects.create(name=name, teacher=teacher)
        log_activity(user=teacher.Name, action="Students assigned to teacher")
        return Response({"message": "Students assigned successfully"}, status=status.HTTP_200_OK)
    except TeacherDetails.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
def get_students_for_teacher(request, teacher_id):
    try:
        teacher = TeacherDetails.objects.get(id=teacher_id)
        students = Student.objects.filter(teacher=teacher)
        serializer = AssignedStudentSerializer(students, many=True)
        print("Students for teacher:", serializer.data) 
        return Response(serializer.data)
    except TeacherDetails.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=404)

@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser])  
def assignment_list(request):
    if request.method == 'GET':
        assignments = Assignment.objects.all().order_by('-id')
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_stats(request):
    data = {
        "total_students": StudentTable.objects.count(),
        "active_teachers": TeacherDetails.objects.count(),
        "running_lessons": CourseTable.objects.count(),
        "notifications": MessageTable.objects.count(),
    }
    return Response(data) 

def log_activity(user, action):
    ActivityLog.objects.create(user=user, action=action)

@api_view(['GET'])
def get_activities(request):
    activities = ActivityLog.objects.all().order_by('-timestamp')[:50] 
    serializer = ActivityLogSerializer(activities, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_teacher_for_student(request, student_id):
    try:
        student_basic = get_object_or_404(StudentTable, id=student_id)
        assigned_student = Student.objects.filter(name=student_basic.name).first()
        teacher_name = assigned_student.teacher.Name if assigned_student and assigned_student.teacher else "No teacher assigned"
        return Response({"teacher": teacher_name}, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error in get_teacher_for_student:", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_teacher(request, teacher_id):
    try:
        teacher = TeacherDetails.objects.get(id=teacher_id)
        teacher.delete()
        log_activity(user="System", action="Teacher removed from system successfully")

        return Response({"message": "Teacher deleted successfully"}, status=200)
    except TeacherDetails.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=404)
@csrf_exempt
def delete_student(request, student_id):
    if request.method == "DELETE":
        student = get_object_or_404(StudentTable, id=student_id)
        student.delete()
        return JsonResponse({"message": "Student deleted successfully"}, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=400)

@api_view(['GET'])
def search_users(request):
    query = request.GET.get("q", "").strip()
    if not query:
        return Response([], status=200)

    students = StudentTable.objects.filter(
        Q(name__icontains=query) | Q(studentNumber__icontains=query)
    )

    teachers = TeacherDetails.objects.filter(
        Q(Name__icontains=query) | Q(TeacherNumber__icontains=query)
    )

    results = []

    for s in students:
        results.append({
            "id": s.id,
            "name": s.name,
            "type": "student",
            "identifier": s.studentNumber,   
            "email": getattr(s, "email", None),  
        })

    for t in teachers:
        results.append({
            "id": t.id,
            "name": t.Name,
            "type": "teacher",
            "identifier": t.TeacherNumber,   
            "email": t.Email,
        })

    return Response(results, status=200)

@api_view(['PUT', 'PATCH'])
def UpdateCourse(request, pk):
    try:
        course = CourseTable.objects.get(pk=pk)
    except CourseTable.DoesNotExist:
        return Response({"message": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CourseTableSerializer(course, data=request.data, partial=True) 
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Course updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
    return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def DeleteCourse(request, pk):
    try:
        course = CourseTable.objects.get(pk=pk)
    except CourseTable.DoesNotExist:
        return Response({"message": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    course.delete()
    return Response({"message": "Course deleted successfully"}, status=status.HTTP_204_NO_CONTENT)