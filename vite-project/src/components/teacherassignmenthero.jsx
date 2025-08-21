import React, { useState } from "react";
import { FaBookOpen, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
export default function TeacherAssignmentHero() {
  const [assignments, setAssignments] = useState([
    { id: 1, title: "Quadratic Equations Worksheet", class: "Algebra II", dueDate: "2024-01-15", status: "Active", submitted: 22, total: 28, file: null },
    { id: 2, title: "Derivative Practice Problems", class: "Calculus", dueDate: "2024-01-18", status: "Active", submitted: 18, total: 22, file: null },
    { id: 3, title: "Statistics Project", class: "Statistics", dueDate: "2024-01-22", status: "Draft", submitted: 0, total: 25, file: null },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    class: "",
    dueDate: "",
    status: "Draft",
    submitted: 0,
    total: 0,
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAssignment((prev) => ({
        ...prev,
        file,
        fileURL: URL.createObjectURL(file), // for local preview
      }));
    }
  };

 const handleSubmit = async () => {
  const formData = new FormData();
  formData.append("title", newAssignment.title);
  formData.append("class_name", newAssignment.class);
  formData.append("due_date", newAssignment.dueDate);
  formData.append("status", newAssignment.status);
  formData.append("submitted", newAssignment.submitted);
  formData.append("total", newAssignment.total);
  if (newAssignment.file) {
    formData.append("file", newAssignment.file);
  }

  try {
    const response = await axios.post("http://127.0.0.1:8000/Hub/assignments/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const addedAssignment = response.data;
    setAssignments((prev) => [...prev, addedAssignment]);

    setNewAssignment({
      title: "",
      class: "",
      dueDate: "",
      status: "Draft",
      submitted: 0,
      total: 0,
      file: null,
    });
    setShowForm(false);
  } catch (error) {
if (error.response) {
console.error("Backend validation error:", JSON.stringify(error.response.data, null, 2));
} else {
  console.error("Error creating assignment:", error.message);
}
  }
};

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
          <p className="text-slate-600 mt-1">Create and manage assignments for your classes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
        >
          Create Assignment
        </button>
      </div>

      {/* Modal / Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-xl shadow-md border space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Assignment Title"
              value={newAssignment.title}
              onChange={handleChange}
              className="border p-2 rounded-md text-black w-full"
            />
            <input
              type="text"
              name="class"
              placeholder="Class Name"
              value={newAssignment.class}
              onChange={handleChange}
              className="border p-2 text-black rounded-md w-full"
            />
            <input
              type="date"
              name="dueDate"
              value={newAssignment.dueDate}
              onChange={handleChange}
              className="border text-black p-2 rounded-md w-full"
            />
               <select
              name="status"
              value={newAssignment.status}
              onChange={handleChange}
              className="border p-2 text-black rounded-md w-full"
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
            </select>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="border p-2 rounded-md text-black col-span-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Save Assignment
            </button>
          </div>
        </div>
      )}

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaBookOpen className="h-5 w-5 text-slate-600" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{assignment.title}</h2>
                  <p className="text-sm text-slate-600">{assignment.class}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`
                  text-xs px-2 py-1 rounded font-medium
                  ${assignment.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-slate-200 text-slate-700"}
                `}>
                  {assignment.status}
                </span>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaCalendarAlt className="h-4 w-4" />
                  Due: {assignment.dueDate}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {assignment.submitted}/{assignment.total} submissions
              </div>
              <div className="flex gap-2 items-center">
                {assignment.fileURL && (
                  <a
                    href={assignment.fileURL}
                    download={assignment.file?.name}
                    className="px-3 py-1 text-sm text-blue-600 underline"
                  >
                    Download
                  </a>
                )}
                <button className="px-3 py-1 text-sm rounded-md text-black bg-[#ffc01d] hover:text-white border border-slate-300 hover:bg-black">
                  View Submissions
                </button>
                <button className="px-3 py-1 text-sm rounded-md bg-black hover:bg-[#ffc01d] text-white">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
