from django.db import models

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
    Name =models.CharField(max_length=255)
    Teacher = models.CharField(max_length=255)
    Students = models.CharField(max_length=255)
    Schedule =models.DateField()
    Status = models.CharField(max_length=255)
class EventTable(models.Model):
    Title = models.CharField(max_length=255)
    Date = models.DateField()
    Time = models.TimeField()
    Location = models.CharField(max_length=255)
    Type = models.CharField(max_length=255)





# Create your models here.
