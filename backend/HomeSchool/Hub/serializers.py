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
        fields = '__all__'

class LessonScheduleSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.Name", read_only=True)

    class Meta:
        model = LessonSchedule
        fields = '__all__'

class TeacherWithLessonsSerializer(serializers.ModelSerializer):
    lessons = LessonScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = TeacherDetails
        fields = ["id", "Name", "Grade", "Unit", "lessons"]

class AssignedStudentSerializer(serializers.ModelSerializer):
    teacher = TeacherWithLessonsSerializer(read_only=True)

    class Meta:
        model = Student
        fields = '__all__'


class AssignmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = '__all__'

    def get_file_url(self, obj):
        request = self.context.get("request", None)
        if obj.file and hasattr(obj.file, "url"):
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url  
        return None


class SubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)

    class Meta:
        model = Submission
        fields = "__all__"

class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'


        
class MeetingSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.Name", read_only=True)

    class Meta:
        model = Meeting
        fields = [
            "id",
            "title",
            "description",
            "date",
            "time",
            "duration",
            "grade",
            "status",
            "created_at",
            "teacher",       
            "teacher_name",
        ]
