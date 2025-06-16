from django.db import models

class Principallogin (models.Model):

    EmailName = models.CharField(max_length=255)
    Password = models.CharField(max_length=255)  

class StudentTable(models.Model):
    RegNumber = models.CharField(max_length=255) 
    Password = models.CharField(max_length=255)
class TeacherTable(models.Model):
    TeacherNumber = models.CharField(max_length=255) 
    Password = models.CharField(max_length=255)


# Create your models here.
