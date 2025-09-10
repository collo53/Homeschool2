import { useEffect, useState } from "react";
import axios from "axios";
import { FaBookOpen, FaUsers, FaCalendarAlt, FaCommentDots } from "react-icons/fa";

export default function TeachersDashboardHero() {
  const [stats, setStats] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingActivities, setUpcomingActivities] = useState([]);

  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacher");
    if (storedTeacher) {
      setTeacher(JSON.parse(storedTeacher));
    }

    async function fetchStats() {
      try {
        const res = await axios.get(`https://homeschool2.onrender.com/Hub/teachers/${teacherId}/stats/`);
        const data = res.data;

        setStats([
          {
            title: "My Classes",
            value: data.my_classes,
            change: "This week",
            icon: <FaBookOpen className="h-5 w-5 text-green-600" />,
            bgColor: "bg-green-50",
          },
          {
            title: "Total Students",
            value: data.total_students,
            change: "Across all classes",
            icon: <FaUsers className="h-5 w-5 text-blue-600" />,
            bgColor: "bg-blue-50",
          },
          {
            title: "Upcoming Classes",
            value: data.upcoming_classes,
            change: "Today",
            icon: <FaCalendarAlt className="h-5 w-5 text-purple-600" />,
            bgColor: "bg-purple-50",
          },
          {
            title: "Unread Messages",
            value: data.unread_messages,
            change: "Inbox",
            icon: <FaCommentDots className="h-5 w-5 text-orange-600" />,
            bgColor: "bg-orange-50",
          },
        ]);
      } catch (err) {
        console.error("Error fetching teacher stats:", err);
      }
    }

    async function fetchActivities() {
      try {
        const recentRes = await axios.get(`https://homeschool2.onrender.com/Hub/teachers/${teacherId}/recent-activities/`);
        setRecentActivities(recentRes.data);

        const upcomingRes = await axios.get(`https://homeschool2.onrender.com/Hub/teachers/${teacherId}/upcoming-activities/`);
        setUpcomingActivities(upcomingRes.data);
      } catch (err) {
        console.error("Error fetching activities:", err);
      }
    }

    fetchStats();
    fetchActivities();
  }, [teacherId]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome Back, {teacher?.Name || "Teacher"}
          </h1>
          <p className="text-slate-600 mt-1">
            Here's what's happening with your classes today
          </p>
        </div>
        <div className="text-sm text-slate-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between pb-2">
              <div className="text-sm font-medium text-slate-600">{stat.title}</div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>{stat.icon}</div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-3">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
          {recentActivities.length > 0 ? (
            recentActivities.map((act, idx) => (
              <div key={idx} className="border-b last:border-0 pb-2">
                <p className="font-medium text-slate-800">{act.title}</p>
                <p className="text-sm text-slate-500">{act.description}</p>
                <span className="text-xs text-slate-400">{new Date(act.date).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No recent activity found.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-3">Upcoming Activities</h2>
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
          {upcomingActivities.length > 0 ? (
            upcomingActivities.map((act, idx) => (
              <div key={idx} className="border-b last:border-0 pb-2">
                <p className="font-medium text-slate-800">{act.title}</p>
                <p className="text-sm text-slate-500">{act.description}</p>
                <span className="text-xs text-slate-400">{new Date(act.date).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No upcoming activities scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
}
