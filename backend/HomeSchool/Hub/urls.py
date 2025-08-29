from django.urls import path
from .views import PrincipalLogin ,StudentLogin, TeacherLogin, AddTeacher,GetTeachers,AddStudent,GetStudents,AddCourse,GetCourses,AddEvents,GetEvents,AddMessage,GetMessages,UpdateEmail, UpdatePassword,GetTeacherCoursesById,assign_students,get_students_for_teacher,assignment_list,get_stats,get_activities,delete_teacher,delete_student,search_users,AddCourseSchedule,GetTeacherLessons,submit_assignment,get_submissions
from django.conf import settings
from django.conf.urls.static import static
from . import views


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
    path("addmessage/", AddMessage, name="AddMessage"),
    path('getmessages/', GetMessages, name='GetMessages'),
    path("update-email/", UpdateEmail.as_view(), name="update_email"),
    path("update-password/", UpdatePassword.as_view(), name="update_password"),
    path('assign-students/', assign_students, name='assign-students'),
    path("getteachercoursesbyid/<int:teacher_id>/", GetTeacherCoursesById),
    path('getstudentsforteacher/<int:teacher_id>/', get_students_for_teacher),
    path("assignments/", assignment_list, name="assignment_list"),  
    path("assignments/teacher/<int:teacher_id>/", assignment_list, name="assignment_list_for_teacher"),    path('stats/', get_stats, name='get_stats'),
    path('assignments/<int:pk>/', views.assignment_detail, name="assignment-detail"),  
    path('activities/', get_activities, name='get_activities'),
    path('delete-teacher/<int:teacher_id>/', delete_teacher, name='delete_teacher'),
    path("delete-student/<int:student_id>/", views.delete_student, name="delete_student"),
    path('delete-student/<int:student_id>/', delete_student, name='delete_student'),
    path('search-users/', search_users, name='search_users'),
    path('updatecourse/<int:pk>/', views.UpdateCourse, name="updatecourse"),
    path('deletecourse/<int:pk>/', views.DeleteCourse, name="deletecourse"),
    path('getteacherforstudent/<int:student_id>/', views.get_teacher_for_student, name='get_teacher_for_student'),
    path('addcourse-schedule/', AddCourseSchedule, name='add_course_schedule'),
    path("get-lessons/<int:teacher_id>/", GetTeacherLessons, name="get_teacher_lessons"),
    path("update-lesson/<int:lesson_id>/", views.update_lesson, name="update_lesson"),
    path("assignments/<int:assignment_id>/submissions/<int:student_id>/", submit_assignment),
    path("assignments/<int:assignment_id>/submissions/", get_submissions),
    path("meetings/", views.list_meetings, name="list_meetings"),
    path("meetings/create/", views.create_meeting, name="create_meeting"),
    path("meetings/<int:pk>/update/", views.update_meeting, name="update_meeting"),
    path("meetings/<int:pk>/delete/", views.delete_meeting, name="delete_meeting"),
    path("teachers/<int:teacher_id>/change-password/", views.change_teacher_password, name="change_teacher_password"),
    path("teachers/<int:teacher_id>/stats/", views.get_teacher_stats, name="get_teacher_stats"),
    path("teachers/<int:teacher_id>/recent-activities/", views.recent_activities, name="recent_activities"),
    path("teachers/<int:teacher_id>/upcoming-activities/", views.upcoming_activities, name="upcoming_activities"),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


