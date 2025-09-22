import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaUsers,
  FaComments
} from "react-icons/fa";

const StudentsDashboard = () => {
  const studentId = localStorage.getItem("studentId");
const storedStudent = JSON.parse(localStorage.getItem("studentTable"));

  const [stats, setStats] = useState({});
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recentLessons, setRecentLessons] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);

  useEffect(() => {
    if (!studentId) return;


    axios.get(`https://homeschool2.onrender.com/Hub/student/${studentId}/stats/`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err));

    axios.get(`https://homeschool2.onrender.com/Hub/student/${studentId}/upcoming-classes/`)
      .then(res => {
        const formatted = res.data.map(cls => ({
          subject: cls.unit,
          teacher: cls.teacher,
          room: cls.room || "N/A",
          time: cls.start_time
        }));
        setUpcomingClasses(formatted);
      })
      .catch(err => console.error(err));

    axios.get(`https://homeschool2.onrender.com/Hub/student/${studentId}/recent-lessons/`)
      .then(res => {
        const formatted = res.data.map(lesson => ({
          subject: lesson.subject,
          topic: lesson.topic,
          completed: lesson.completed,
          grade: lesson.grade || null,
          dueDate: lesson.submitted_at ? new Date(lesson.submitted_at).toLocaleDateString() : "N/A",
        }));
        setRecentLessons(formatted);
      })
      .catch(err => console.error(err));

    axios.get(`https://homeschool2.onrender.com/Hub/student/${studentId}/upcoming-meetings/`)
      .then(res => {
        const formatted = res.data.map(meeting => ({
          title: meeting.title,
          description: meeting.description || "No description",
          date: new Date(meeting.date + "T" + meeting.time), 
        }));
        setUpcomingMeetings(formatted);
      })
      .catch(err => console.error(err));

  }, [studentId]);

  const quickStats = [
    { title: "Current Classes", value: stats.current_classes || 0, icon: <FaBookOpen />, color: "bg-blue-500" },
    { title: "Upcoming Meetings", value: stats.upcoming_meetings || 0, icon: <FaVideo />, color: "bg-purple-500" },
    { title: "Unread Messages", value: stats.unread_messages || 0, icon: <FaComments />, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-8 p-6">
      <div>
<h1 className="text-3xl font-bold text-gray-900">
  Welcome back, {storedStudent?.name || storedStudent?.studentNumber || "Student"}!
</h1>
        
        <p className="text-gray-600 mt-2">Here's what's happening with your studies today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
            <FaCalendarAlt className="text-gray-600" /> Today's Schedule
          </div>
          <div className="space-y-4">
            {upcomingClasses.length > 0 ? upcomingClasses.map((classItem, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">{classItem.subject}</h3>
                  <p className="text-sm text-gray-600">{classItem.teacher} • {classItem.room}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center text-sm font-medium text-gray-700 border rounded-full px-2 py-1">
                    <FaClock className="mr-1 h-3 w-3" /> {classItem.time}
                  </span>
                </div>
              </div>
            )) : <p className="text-gray-500">No classes scheduled for today.</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
            <FaBookOpen className="text-gray-600" /> Recent Lessons
          </div>
          <div className="space-y-4">
            {recentLessons.length > 0 ? recentLessons.map((lesson, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">{lesson.subject}</h3>
                  <p className="text-sm text-gray-600">{lesson.topic}</p>
                </div>
                <div className="text-right">
                  {lesson.completed ? (
                    <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">{lesson.grade}</span>
                  ) : (
                    <span className="text-sm border border-orange-500 text-orange-600 px-3 py-1 rounded-full">Due {lesson.dueDate}</span>
                  )}
                </div>
              </div>
            )) : <p className="text-gray-500">No recent lessons found.</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
          <FaVideo className="text-gray-600" /> Upcoming Meetings
        </div>
        <div className="space-y-4">
          {upcomingMeetings.length > 0 ? upcomingMeetings.map((meeting, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <h3 className="font-medium text-gray-800">{meeting.title}</h3>
              <p className="text-sm text-gray-600">{meeting.description}</p>
              <span className="text-xs text-gray-400">{meeting.date.toLocaleString()}</span>
            </div>
          )) : <p className="text-gray-500">No upcoming meetings scheduled.</p>}
        </div>
      </div>
    </div>
  );
};

export default StudentsDashboard;
