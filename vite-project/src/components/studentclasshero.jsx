import { useEffect, useState } from "react";
import axios from "axios";
import { FaBookOpen, FaUsers, FaClock, FaCalendarAlt } from "react-icons/fa";

const StudentClassHero = () => {
  const [classes, setClasses] = useState([]);
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (!studentId) return;
    axios
      .get(`http://127.0.0.1:8000/Hub/student/${studentId}/classes/`)
      .then((res) => {
        const teacher = res.data.teacher;
        if (teacher) {
          const mappedClasses = teacher.lessons.map((lesson) => ({
            subject: lesson.unit,
            teacher: teacher.Name,
            schedule: `${lesson.day} ${lesson.start_time} - ${lesson.end_time}`,
            students: 0, // optional: count from backend if needed
            nextClass: `${lesson.day} ${lesson.start_time}`,
            progress: 0, // optional: calculate from submissions
            grade: teacher.Grade,
            room: "TBD"
          }));
          setClasses(mappedClasses);
        }
        console.log("Fetched classes:", res.data);
      })
      
      .catch((err) => console.error("Error fetching classes:", err));
  }, [studentId]);

  return (
  <div className="space-y-8 p-4">
    <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 relative overflow-hidden"
        >
          {/* Accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ffc01d] to-yellow-500"></div>

          <h2 className="text-2xl font-semibold text-gray-800">{classItem.subject}</h2>
          <p className="text-gray-500">{classItem.teacher}</p>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <FaClock className="text-[#ffc01d]" />
            <span>{classItem.schedule}</span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <FaUsers className="text-[#ffc01d]" />
            <span>{classItem.students} students</span>
          </div>

          <div className="mt-6 pt-4 border-t text-sm text-gray-500 flex items-center">
            <FaCalendarAlt className="text-[#ffc01d] mr-2" />
            <span>Next class: {classItem.nextClass}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

};

export default StudentClassHero;
