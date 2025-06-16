import React from "react";
import { FaPlus, FaSearch, FaBookOpen, FaUsers, FaClock } from "react-icons/fa";

export default function CourseHero({ courses, onAdd, onManage }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Courses</h1>
          <p className="text-slate-600 mt-1">Manage curriculum and class schedules</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <FaPlus className="mr-2" />
          Add Course
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="pl-10 pr-4 py-2 w-full border text-black border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <FaBookOpen className="text-purple-600 text-xl" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold truncate">{course.name}</h2>
                  <p className="text-sm text-slate-600 truncate">{course.teacher}</p>
                </div>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  course.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {course.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-600 mb-4">
              <div className="flex items-center gap-2">
                <FaUsers className="text-sm" />
                <span>{course.students} students enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-sm" />
                <span>{course.schedule}</span>
              </div>
            </div>

            <button
              onClick={() => onManage(course)}
              className="w-full text-blue-600 border border-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 text-sm"
            >
              Manage Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
