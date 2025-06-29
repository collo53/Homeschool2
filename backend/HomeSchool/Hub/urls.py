from django.urls import path
from .views import PrincipalLogin ,StudentLogin, TeacherLogin, AddTeacher,GetTeachers,AddStudent,GetStudents,AddCourse,GetCourses,AddEvents,GetEvents


urlpatterns = [
    path('principallogin/', PrincipalLogin.as_view(), name='PrincipalLogin'),
    path('studentlogin/', StudentLogin.as_view(), name='StudentLogin'),
    path('teacherlogin/', TeacherLogin.as_view(), name='TeacherLogin'),
    path('addteacher/', AddTeacher.as_view(), name='AddTeacher'),
    path('getteachers/', GetTeachers.as_view(), name='GetTeachers'),
    path("addstudent/", AddStudent, name="AddStudent"),
    path('getstudents/', GetStudents.as_view(), name='GetStudents'),
    path("addcourse/", AddCourse, name="AddCourse"),
    path('getcourses/', GetCourses, name='GetCourses'),
    path("addevents/", AddEvents, name="AddEvents"),
    path('getevents/', GetEvents, name='GetEvents'),
]

