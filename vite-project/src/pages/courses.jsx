import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AppSidebar from "../components/AppSidebar";
import Toggle from "../components/toggle";
import CourseHero from "../components/coursehero";
import axios from "axios";

function Courses() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [courses, setCourses] = useState([
    { id: 1, name: "Advanced Mathematics", teacher: "Dr. Sarah Wilson", students: 24, schedule: "Mon, Wed, Fri 9:00 AM", status: "Active" },
    { id: 2, name: "Physics Lab", teacher: "Prof. Michael Brown", students: 18, schedule: "Tue, Thu 2:00 PM", status: "Active" },
    { id: 3, name: "English Literature", teacher: "Ms. Emily Davis", students: 28, schedule: "Mon, Wed, Fri 11:00 AM", status: "On Hold" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", teacher: "", students: 0, schedule: "", status: "Active" 
  });

useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/Hub/getcourses/");
      const normalizedCourses = response.data.map((c, index) => ({
        id: index + 1, 
        name: c.Name,
        teacher: c.Teacher,
        students: c.Students,
        schedule: c.Schedule,
        status: c.Status,
      }));
      setCourses(normalizedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  fetchCourses();
}, []);



  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleAdd = async () => {
  const newCourse = {
    Name: formData.name,
    Teacher: formData.teacher,
    Students: formData.students,
    Schedule: formData.schedule,
    Status: formData.status,
  };

  try {
    await axios.post("http://127.0.0.1:8000/Hub/addcourse/", newCourse);
    const response = await axios.get("http://127.0.0.1:8000/Hub/getcourses/");
    const normalizedCourses = response.data.map((c, index) => ({
      id: index + 1,
      name: c.Name,
      teacher: c.Teacher,
      students: c.Students,
      schedule: c.Schedule,
      status: c.Status,
    }));
    setCourses(normalizedCourses);
  } catch (error) {
    console.error("Error adding course", error);
  }

  setShowAddModal(false);
};

  const handleUpdate = () => {
    const updated = courses.map(c => c.id === editingCourse.id ? { ...formData, id: c.id } : c);
    setCourses(updated);
    setEditingCourse(null);
  };

  const handleDelete = (id) => {
    setCourses(courses.filter(c => c.id !== id));
    setEditingCourse(null);
  };

  return (
    <div className="w-screen min-h-screen flex bg-gray-100 relative overflow-hidden">
      <Toggle toggleSidebar={toggleSidebar} />

      <div
        className={`fixed top-0 left-0 h-screen w-72 bg-black text-white transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar />
      </div>

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "pl-72" : "pl-0"}`}>
        <div className="pt-12 px-6">
          <CourseHero
            courses={courses}
            onAdd={() => setShowAddModal(true)}
            onManage={(course) => {
              setEditingCourse(course);
              setFormData(course);
            }}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingCourse) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-black text-center">Add Course</h2>
            <input
              type="text"
              name="name"
              className="w-full mb-2 p-2 border rounded text-black"
              placeholder="Course Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text"
              name="teacher"
              className="w-full mb-2 p-2 border rounded text-black"
              placeholder="Teacher Name"
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
            />
            <input
              type="number"
              name="students"
              className="w-full mb-2 p-2 border rounded text-black"
              placeholder="Students"
              value={formData.students}
              onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) })}
            />
            <input
              type="date"
              name="schedule"
              className="w-full mb-2 p-2 border rounded text-black"
              placeholder="Schedule"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            />
            <select
            name="status"
              className="w-full mb-4 p-2 border rounded text-black"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
            </select>

            <div className="flex justify-end gap-2 text-black" >
              {editingCourse && (
                <button onClick={() => handleDelete(editingCourse.id)} className="bg-red-600 text-white px-4 py-2 rounded">
                  Delete
                </button>
              )}
              <button onClick={() => { setShowAddModal(false); setEditingCourse(null); }} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={editingCourse ? handleUpdate : handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editingCourse ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
