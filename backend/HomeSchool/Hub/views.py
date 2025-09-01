from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes,permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404 
import json
from django.views import View
from .models import *
from .serializers import PrincipalLoginSerializer, StudentTableSerializer, TeacherTableSerializer,CourseTableSerializer,EventTableSerializer, MessageTableSerializer,AssignedStudentSerializer,AssignmentSerializer, ActivityLogSerializer, LessonScheduleSerializer, SubmissionSerializer,MeetingSerializer
from django.contrib.auth.hashers import make_password,check_password
from django.db.models import Q
from django.http import JsonResponse ,Http404
from django.contrib.auth import authenticate
from django.contrib.auth import authenticate, get_user_model
from rest_framework import generics, permissions
from django.db.models import F,OuterRef, Subquery
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.http import require_http_methods
from django.utils.timezone import now
from datetime import datetime

 

User = get_user_model()

class PrincipalLogin(APIView):
    def post(self, request):
        email = request.data.get("Email")
        password = request.data.get("Password")

        if not email or not password:
            return Response({"message": " Missing credentials"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

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
        serializer.save()  
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
            user.username = new_email 
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
    except TeacherDetails.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=404)

    student_details = Student.objects.filter(teacher=teacher).annotate(
        grade=Subquery(StudentTable.objects.filter(name=OuterRef('name')).values('grade')[:1]),
        studentNumber=Subquery(StudentTable.objects.filter(name=OuterRef('name')).values('studentNumber')[:1]),
        courses=Subquery(StudentTable.objects.filter(name=OuterRef('name')).values('courses')[:1]),
    ).values('id', 'name', 'grade', 'studentNumber', 'courses')

    return Response(list(student_details))

@api_view(['GET', 'POST', 'PUT'])
@parser_classes([MultiPartParser, FormParser])  
def assignment_list(request, teacher_id=None, assignment_id=None):
    if request.method == 'GET':
        if teacher_id:
            assignments = Assignment.objects.filter(teacher__id=teacher_id).order_by('-id')
        else:
            assignments = Assignment.objects.all().order_by('-id')
        
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'PUT', 'DELETE'])
@parser_classes([MultiPartParser, FormParser])  
def assignment_detail(request, pk):
    try:
        assignment = Assignment.objects.get(pk=pk)
    except Assignment.DoesNotExist:
        return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AssignmentSerializer(assignment)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = AssignmentSerializer(assignment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        assignment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
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

@api_view(['POST'])
def AddCourseSchedule(request):
    serializer = LessonScheduleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        log_activity(user="System", action="Teacher  added schedule  to system")
        return Response({"message": "Schedule added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def GetTeacherLessons(request, teacher_id):
    try:
        lessons = LessonSchedule.objects.filter(teacher_id=teacher_id)
        serializer = LessonScheduleSerializer(lessons, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["PUT"])
def update_lesson(request, lesson_id):
    try:
        lesson = LessonSchedule.objects.get(id=lesson_id)
    except LessonSchedule.DoesNotExist:
        return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = LessonScheduleSerializer(lesson, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

        teacher_name = lesson.teacher.Name if lesson.teacher else "Unknown Teacher"
        unit_name = lesson.unit
        log_activity(
            user=request.user.username if request.user.is_authenticated else "System",
            action=f"Teacher {teacher_name} updated lesson '{unit_name}' on {lesson.day}"
        )

        return Response(
            {"message": "Lesson updated successfully", "data": serializer.data},
            status=status.HTTP_200_OK
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def submit_assignment(request, assignment_id, student_id):
    try:
        assignment = Assignment.objects.get(id=assignment_id)
        student = Student.objects.get(id=student_id)
    except (Assignment.DoesNotExist, Student.DoesNotExist):
        return Response({"error": "Assignment or Student not found"}, status=404)

    serializer = SubmissionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(assignment=assignment, student=student)
        assignment.submitted = assignment.submissions.count()
        assignment.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_submissions(request, assignment_id):
    try:
        assignment = Assignment.objects.get(id=assignment_id)
    except Assignment.DoesNotExist:
        return Response({"error": "Assignment not found"}, status=404)

    submissions = assignment.submissions.all()
    serializer = SubmissionSerializer(submissions, many=True)
    return Response(serializer.data)
@api_view(["POST"])
def create_meeting(request):
    teacher_id = request.data.get("teacher")
    if not teacher_id:
        return Response({"error": "Teacher ID is required"}, status=400)

    try:
        teacher = TeacherDetails.objects.get(id=teacher_id)
    except TeacherDetails.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=404)

    serializer = MeetingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(teacher=teacher)  # attach teacher from ID
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def list_meetings(request):
    teacher_id = request.query_params.get("teacher")
    if not teacher_id:
        return Response({"error": "Teacher ID is required"}, status=400)

    try:
        teacher = TeacherDetails.objects.get(id=teacher_id)
    except TeacherDetails.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=404)

    meetings = Meeting.objects.filter(teacher=teacher).order_by("-created_at")
    serializer = MeetingSerializer(meetings, many=True)
    return Response(serializer.data)


@csrf_exempt
@require_http_methods(["PUT"])
def update_meeting(request, pk):
    try:
        meeting = Meeting.objects.get(pk=pk)
    except Meeting.DoesNotExist:
        return JsonResponse({"error": "Meeting not found"}, status=404)

    data = json.loads(request.body)
    meeting.title = data.get("title", meeting.title)
    meeting.description = data.get("description", meeting.description)
    meeting.date = data.get("date", meeting.date)
    meeting.time = data.get("time", meeting.time)
    meeting.duration = data.get("duration", meeting.duration)
    meeting.grade = data.get("grade", meeting.grade)
    meeting.status = data.get("status", meeting.status)
    meeting.save()

    return JsonResponse({
        "id": meeting.id,
        "title": meeting.title,
        "description": meeting.description,
        "date": meeting.date,
        "time": meeting.time,
        "duration": meeting.duration,
        "grade": meeting.grade,
        "status": meeting.status,
        "teacher": meeting.teacher.id,
    })

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_meeting(request, pk):
    try:
        meeting = Meeting.objects.get(pk=pk)
        meeting.delete()
        return JsonResponse({"message": "Meeting deleted successfully"}, status=200)
    except Meeting.DoesNotExist:
        return JsonResponse({"error": "Meeting not found"}, status=404)  
    
@csrf_exempt
def change_teacher_password(request, teacher_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            current_password = data.get("current_password")
            new_password = data.get("new_password")

            teacher = TeacherDetails.objects.get(id=teacher_id)

            if not check_password(current_password, teacher.Password):
                return JsonResponse({"error": "Current password is incorrect"}, status=400)

            teacher.Password = make_password(new_password)
            teacher.save()

            return JsonResponse({"message": "Password updated successfully!"})

        except TeacherDetails.DoesNotExist:
            return JsonResponse({"error": "Teacher not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@api_view(['GET'])
def get_teacher_stats(request, teacher_id):
    try:
        teacher = TeacherDetails.objects.get(id=teacher_id)

        data = {
            "my_classes": LessonSchedule.objects.filter(teacher=teacher).count(),
            "total_students": Student.objects.filter(teacher=teacher).count(),
            "upcoming_classes": LessonSchedule.objects.filter(
                teacher=teacher, 
                day=now().strftime("%A"),  
                start_time__gte=now().time()
            ).count(),
            "unread_messages": MessageTable.objects.filter(
                Receiver=teacher.Email, Status="unread"
            ).count(),
        }

        return Response(data)

    except TeacherDetails.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=404)


@api_view(["GET"])
def recent_activities(request, teacher_id):
    """
    Return the 5 most recent activity logs for the teacher.
    """
    try:
        teacher = TeacherDetails.objects.get(id=teacher_id)
    except TeacherDetails.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)

    logs = (
        ActivityLog.objects.filter(user=teacher.Name)
        .order_by("-timestamp")[:5]
    )

    data = [
        {
            "title": log.action,
            "description": f"By {log.user}",
            "date": log.timestamp,
        }
        for log in logs
    ]
    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
def upcoming_activities(request, teacher_id):
    """
    Return upcoming lessons, meetings, and events for the teacher (next 7 days).
    """
    try:
        teacher = TeacherDetails.objects.get(id=teacher_id)
    except TeacherDetails.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)

    today = timezone.now().date()
    next_week = today + timezone.timedelta(days=7)

    lessons = LessonSchedule.objects.filter(
        teacher=teacher,
        is_completed=False
    )

    meetings = Meeting.objects.filter(
        teacher=teacher,
        status="scheduled",
        date__range=[today, next_week]
    ).order_by("date", "time")

    events = EventTable.objects.filter(
        Date__range=[today, next_week]
    ).order_by("Date", "Time")

    lesson_data = [
        {
            "title": f"Lesson: {lesson.unit}",
            "description": f"{lesson.day} from {lesson.start_time} - {lesson.end_time}",
            "date": today,  
        }
        for lesson in lessons
    ]

    meeting_data = [
        {
            "title": meeting.title,
            "description": meeting.description or "No description",
            "date": datetime.combine(meeting.date, meeting.time),
        }
        for meeting in meetings
    ]

    event_data = [
        {
            "title": event.Title,
            "description": f"{event.Type} at {event.Location}",
            "date": datetime.combine(event.Date, event.Time),
        }
        for event in events
    ]

    return Response(lesson_data + meeting_data + event_data, status=status.HTTP_200_OK)


class StudentClassesView(APIView):
    def get(self, request, student_id):
        try:
            student = Student.objects.get(id=student_id)
            serializer = AssignedStudentSerializer(student)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
@api_view(["GET"])
def student_assignments(request, student_id):
    try:
        student = get_object_or_404(Student, id=student_id)

        assignments = Assignment.objects.filter(teacher=student.teacher)

        serializer = AssignmentSerializer(assignments, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Error in student_assignments:", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@require_http_methods(["POST"])
def assignment_sub(request):
    try:
        assignment_id = request.POST.get("assignment")
        student_id = request.POST.get("student")
        file = request.FILES.get("file")

        if not all([assignment_id, student_id, file]):
            return JsonResponse({"error": "Missing required fields"}, status=400)

        assignment = Assignment.objects.get(id=assignment_id)
        student = Student.objects.get(id=student_id)

        # Check if already submitted
        if Submission.objects.filter(assignment=assignment, student=student).exists():
            return JsonResponse({"error": "Already submitted"}, status=400)

        submission = Submission.objects.create(
            assignment=assignment,
            student=student,
            file=file
        )

        return JsonResponse({
            "message": "Submission successful",
            "submission_id": submission.id,
            "submitted_at": submission.submitted_at
        }, status=201)

    except Assignment.DoesNotExist:
        return JsonResponse({"error": "Assignment not found"}, status=404)
    except Student.DoesNotExist:
        return JsonResponse({"error": "Student not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
@api_view(['GET'])
def get_student_meetings(request, student_id):
    try:
        student = Student.objects.get(id=student_id)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    meetings = Meeting.objects.filter(teacher=student.teacher)

    serializer = MeetingSerializer(meetings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def GetTeacherMessages(request, teacher_number=None):  
    if teacher_number and teacher_number != "null":  
        messages = MessageTable.objects.filter(
            models.Q(Sender=teacher_number) | models.Q(Receiver=teacher_number)
        ).order_by('-DateSent')
    else:
        messages = MessageTable.objects.all().order_by('-DateSent')

    serializer = MessageTableSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def GetStudentMessages(request, student_number=None):
    """
    Retrieve messages sent to or from a specific student.
    """
    if student_number and student_number != "null":
        student_number = student_number.strip()  
        messages = MessageTable.objects.filter(
            models.Q(Sender__iexact=student_number) | 
            models.Q(Receiver__iexact=student_number)
        ).order_by('-DateSent')
    else:
        messages = MessageTable.objects.all().order_by('-DateSent')

    serializer = MessageTableSerializer(messages, many=True)
    return Response(serializer.data)

@csrf_exempt
def change_student_password(request, student_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            current_password = data.get("current_password")
            new_password = data.get("new_password")

            student = StudentTable.objects.get(id=student_id)

            if not check_password(current_password, student.Password):
                return JsonResponse({"error": "Current password is incorrect"}, status=400)

            student.Password = make_password(new_password)
            student.save()

            return JsonResponse({"message": "Password updated successfully!"})

        except StudentTable.DoesNotExist:
            return JsonResponse({"error": "Student not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)
@api_view(['GET'])
def get_student_stats(request, student_id):
    try:
        student = Student.objects.get(id=student_id)
        today = now().date()

        data = {
            "current_classes": LessonSchedule.objects.filter(
                teacher=student.teacher
            ).count(),
            "completed_lessons": Submission.objects.filter(
                student=student, grade__isnull=False
            ).count(),
            "upcoming_meetings": Meeting.objects.filter(
                grade=student.teacher.Grade, status="scheduled", date__gte=today
            ).count(),
            "unread_messages": MessageTable.objects.filter(
                Receiver=student.name, Status="unread"
            ).count(),
        }
        return Response(data)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

@api_view(['GET'])
def get_recent_lessons(request, student_id):
    try:
        student = Student.objects.get(id=student_id)
        submissions = Submission.objects.filter(student=student).order_by('-submitted_at')[:5]

        data = [
            {
                "subject": sub.assignment.class_name,
                "topic": sub.assignment.title,
                "completed": bool(sub.grade),
                "grade": sub.grade if sub.grade else None,
                "submitted_at": sub.submitted_at,
            }
            for sub in submissions
        ]
        return Response(data)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)


@api_view(['GET'])
def get_upcoming_classes(request, student_id):
    try:
        student = Student.objects.get(id=student_id)
        today = now().date()
        current_day = now().strftime("%A")

        lessons = LessonSchedule.objects.filter(
            teacher=student.teacher,
            day=current_day,
            start_time__gte=now().time()
        ).order_by('start_time')

        data = [
            {
                "subject": lesson.unit,
                "teacher": lesson.teacher.Name,
                "day": lesson.day,
                "start_time": lesson.start_time,
                "end_time": lesson.end_time
            }
            for lesson in lessons
        ]
        return Response(data)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
    

@api_view(['GET'])
def get_upcoming_meetings(request, student_id):
    try:
        student = Student.objects.get(id=student_id)
        today = now().date()

        meetings = Meeting.objects.filter(
            grade=student.teacher.Grade,
            status="scheduled",
            date__gte=today
        ).order_by('date', 'time')

        data = [
            {
                "title": meeting.title,
                "description": meeting.description,
                "date": meeting.date,
                "time": meeting.time
            }
            for meeting in meetings
        ]
        return Response(data)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
