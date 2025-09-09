import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AppSidebar from "../components/AppSidebar";
import Toggle from "../components/toggle";
import CourseHero from "../components/coursehero";
import axios from "axios";
import { toast } from "react-toastify";


function Courses() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [courses, setCourses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "Active"
  });

 useEffect(() => {
  const fetchData = async () => {
    try {
      const courseRes = await axios.get("http://127.0.0.1:8000/Hub/getcourses/");
      const normalizedCourses = courseRes.data.map((c) => ({
        id: c.id, 
        name: c.Name,
        status: c.Status,
      }));
      setCourses(normalizedCourses);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };
  fetchData();
}, []);


  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleAdd = async () => {
    const newCourse = {
      Name: formData.name,
      Status: formData.status,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/Hub/addcourse/", newCourse);
      console.log("Add response:", response.data);

      const updatedCourses = await axios.get("http://127.0.0.1:8000/Hub/getcourses/");
      const normalizedCourses = updatedCourses.data.map((c, index) => ({
        id: index + 1,
        name: c.Name,
        status: c.Status,
      }));
      setCourses(normalizedCourses);
            toast.success(" Course added successfully!");

    } catch (error) {
      console.error("Error adding course", error);
            toast.error(" Failed to add course");

    }

    setShowAddModal(false);
  };

  const handleUpdate = async () => {
  try {
    const updatedCourse = {
      Name: formData.name,
      Status: formData.status,
    };

    await axios.put(
      `http://127.0.0.1:8000/Hub/updatecourse/${editingCourse.id}/`,
      updatedCourse
    );

    const updatedCourses = await axios.get("http://127.0.0.1:8000/Hub/getcourses/");
    const normalizedCourses = updatedCourses.data.map((c) => ({
      id: c.id, 
      name: c.Name,
      status: c.Status,
    }));
    setCourses(normalizedCourses);
      toast.success(" Course updated successfully!");

    setEditingCourse(null);
    setShowAddModal(false);
  } catch (error) {
    console.error("Error updating course", error);
      toast.error(" Failed to update course");

  }
};

const handleDelete = async (id) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/Hub/deletecourse/${id}/`);

    const updatedCourses = await axios.get("http://127.0.0.1:8000/Hub/getcourses/");
    const normalizedCourses = updatedCourses.data.map((c) => ({
      id: c.id, 
      name: c.Name,
      status: c.Status,
    }));
    setCourses(normalizedCourses);
    toast.success(" Course deleted successfully!");

    setEditingCourse(null);
    setShowAddModal(false);
  } catch (error) {
    console.error("Error deleting course", error);
    toast.error(" Failed to delete course");

  }
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
              setFormData({
                name: course.name,
                status: course.status
              });
            }}
          />
        </div>
      </div>

      {(showAddModal || editingCourse) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-black text-center">
              {editingCourse ? "Edit Course" : "Add Course"}
            </h2>

            <input
              type="text"
              name="name"
              className="w-full mb-2 p-2 border rounded text-black"
              placeholder="Course Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

            <div className="flex justify-end gap-2 text-black">
              {editingCourse && (
                <button
                  onClick={() => handleDelete(editingCourse.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCourse(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
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
