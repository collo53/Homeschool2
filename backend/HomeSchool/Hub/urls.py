from django.urls import path
from .views import PrincipalLogin ,StudentLogin, TeacherLogin

urlpatterns = [
    path('principallogin/', PrincipalLogin.as_view(), name='PrincipalLogin'),
    path('studentlogin/', StudentLogin.as_view(), name='StudentLogin'),
    path('teacherlogin/', TeacherLogin.as_view(), name='TeacherLogin'),
]

