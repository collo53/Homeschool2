import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBookOpen, FaUsers, FaCalendarAlt } from 'react-icons/fa';

export default function TeacherClassesHero() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
  const fetchCourses = async () => {
    const teacher = JSON.parse(localStorage.getItem("teacher"));
    const teacherId = teacher?.id;

    if (!teacherId) {
      console.error("Teacher ID not found in localStorage.");
      return;
    }

    try {
      const res = await axios.get(`http://127.0.0.1:8000/Hub/getteachercoursesbyid/${teacherId}/`);
      const courses = res.data.courses;

      const courseList = courses.map((course, idx) => ({
        id: idx + 1,
        name: course.Name || "Unnamed Course",
        period: "To be defined",
        time: course.Schedule ? new Date(course.Schedule).toLocaleDateString() : "N/A",
        room: "To be assigned",
        students: course.Students ? course.Students.split(',').filter(Boolean).length : 0,
        status: course.Status || "Pending"
      }));

        console.log("Courses response:", res.data);

      setClasses(courseList);
    } catch (err) {
      console.error("Failed to load teacher courses", err);
    }
  };

  fetchCourses();
}, []);


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Classes</h1>
          <p className="text-slate-600 mt-1">Manage your class schedules and students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((class_) => (
          <div key={class_.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="px-4 pt-4 pb-2 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-[#ffc01d] flex items-center justify-center">
                    <FaBookOpen className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{class_.name}</h2>
                    <p className="text-sm text-slate-600">{class_.period}</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                  {class_.status}
                </span>
              </div>
            </div>
            <div className="px-4 py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaCalendarAlt className="h-4 w-4" />
                  <span>{class_.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaBookOpen className="h-4 w-4" />
                  <span>{class_.room}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaUsers className="h-4 w-4" />
                  <span>{class_.students} students</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 text-black text-sm px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-100">
                  View Students
                </button>
                <button className="flex-1 text-sm px-4 py-2 bg-[#ffc01d] text-white rounded-md hover:bg-black">
                  Manage Class
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
