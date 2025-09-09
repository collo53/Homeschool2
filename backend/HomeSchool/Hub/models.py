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
    teacher = models.ForeignKey(TeacherDetails, on_delete=models.CASCADE, related_name="assignments",null=True, blank=True)
    students = models.ManyToManyField(Student, blank=True, related_name="assignments")

    def __str__(self):
        return self.title

class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name="submissions")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="submissions")
    file = models.FileField(upload_to="submissions/")
    submitted_at = models.DateTimeField(auto_now_add=True)
    grade = models.CharField(max_length=10, blank=True, null=True)  

    def __str__(self):
        return f"{self.student.name} → {self.assignment.title}"



class ActivityLog(models.Model):
    user = models.CharField(max_length=100) 
    action = models.CharField(max_length=255)     
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user} - {self.action} ({self.timestamp})"


class LessonSchedule(models.Model):
    teacher = models.ForeignKey(
        TeacherDetails, 
        on_delete=models.CASCADE, 
        related_name="lessons"
    )
    unit = models.CharField(max_length=255)

    DAYS_OF_WEEK = [
        ("Monday", "Monday"),
        ("Tuesday", "Tuesday"),
        ("Wednesday", "Wednesday"),
        ("Thursday", "Thursday"),
        ("Friday", "Friday"),
        ("Saturday", "Saturday"),
        ("Sunday", "Sunday"),
    ]
    day = models.CharField(max_length=20, choices=DAYS_OF_WEEK)  
    start_time = models.TimeField()
    end_time = models.TimeField()

    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.unit} - {self.teacher.Name} on {self.day} ({self.start_time} - {self.end_time})"


class Meeting(models.Model):
    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("ongoing", "Ongoing"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    teacher = models.ForeignKey(
        TeacherDetails,
        on_delete=models.CASCADE,
        related_name="meetings"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    date = models.DateField()
    time = models.TimeField()
    duration = models.IntegerField(help_text="Duration in minutes")
    grade = models.CharField(max_length=50, help_text="Grade level for this meeting")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="scheduled")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.date} {self.time}) - Grade {self.grade}"
