from django.db import models
from django.utils import timezone

class Principallogin (models.Model):

    EmailName = models.CharField(max_length=255)
    Password = models.CharField(max_length=255)  

class StudentTable(models.Model):
    name = models.CharField(max_length=255)
    grade = models.CharField(max_length=255)
    studentNumber = models.CharField(max_length=255) 
    Password = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    courses = models.CharField(max_length=255)

    
class TeacherDetails(models.Model):
    Name = models.CharField(max_length=255)
    Email =models.EmailField(max_length=255)
    Phone =models.CharField(max_length=15)
    ID_number = models.CharField(max_length=20, unique=True)  
    TeacherNumber = models.CharField(max_length=255 ) 
    Password = models.CharField(max_length=255)
    Unit = models.CharField(max_length=255)
    Grade = models.CharField(max_length=255)
    DateHired = models.DateField()


class CourseTable(models.Model):
    Name = models.CharField(max_length=255)
    Status = models.CharField(max_length=255)

class EventTable(models.Model):
    Title = models.CharField(max_length=255)
    Date = models.DateField()
    Time = models.TimeField()
    Location = models.CharField(max_length=255)
    Type = models.CharField(max_length=255)
class MessageTable(models.Model):
    Sender = models.CharField(max_length=255)
    Receiver = models.CharField(max_length=255)
    Subject = models.CharField(max_length=255)
    Message = models.TextField()
    DateSent = models.DateTimeField(auto_now_add=True)
    Status = models.CharField(max_length=255)

class Student(models.Model):
    name = models.CharField(max_length=255)
    teacher = models.ForeignKey(TeacherDetails, on_delete=models.CASCADE, related_name="students")

class Assignment(models.Model):
    title = models.CharField(max_length=255)
    class_name = models.CharField(max_length=100)
    due_date = models.DateField()
    status = models.CharField(max_length=50, choices=[('Draft', 'Draft'), ('Active', 'Active')])
    submitted = models.IntegerField(default=0)
    total = models.IntegerField(default=0)
    file = models.FileField(upload_to='assignments/', blank=True, null=True)

    def __str__(self):
        return self.title
    


class ActivityLog(models.Model):
    user = models.CharField(max_length=100) 
    action = models.CharField(max_length=255)     
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user} - {self.action} ({self.timestamp})"
# Create your models here.
