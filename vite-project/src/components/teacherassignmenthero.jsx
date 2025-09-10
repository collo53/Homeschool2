import React, { useState, useEffect } from "react";
import { FaBookOpen, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

export default function TeacherAssignmentHero() {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    class: "",
    dueDate: "",
    status: "Draft",
    submitted: 0,
    total: 0,
    file: null,
  });

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const teacherId = localStorage.getItem("teacherId");
        const response = await axios.get(
          `https://homeschool2.onrender.com/Hub/assignments/teacher/${teacherId}/`
        );
        setAssignments(
          response.data.map((a) => ({
            ...a,
            class: a.class_name,
            dueDate: a.due_date,
            fileURL: a.file ? `https://homeschool2.onrender.com${a.file}` : null,
          }))
        );
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, []);

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
        fileURL: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    const teacherId = localStorage.getItem("teacherId");

    formData.append("title", newAssignment.title);
    formData.append("class_name", newAssignment.class);
    formData.append("due_date", newAssignment.dueDate);
    formData.append("status", newAssignment.status);
    formData.append("submitted", newAssignment.submitted);
    formData.append("teacher", teacherId);
    formData.append("total", newAssignment.total);
    if (newAssignment.file) formData.append("file", newAssignment.file);

    try {
      if (isEditing && selectedAssignment) {
        const response = await axios.put(
          `https://homeschool2.onrender.com/Hub/assignments/${selectedAssignment.id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setAssignments((prev) =>
          prev.map((a) =>
            a.id === selectedAssignment.id
              ? { ...response.data, class: response.data.class_name }
              : a
          )
        );
      } else {
        const response = await axios.post(
          "https://homeschool2.onrender.com/Hub/assignments/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const addedAssignment = response.data;
        setAssignments((prev) => [
          ...prev,
          {
            ...addedAssignment,
            class: addedAssignment.class_name,
            fileURL: addedAssignment.file
              ? `https://homeschool2.onrender.com${addedAssignment.file}`
              : null,
          },
        ]);
      }

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
      setIsEditing(false);
      setSelectedAssignment(null);
      toast.success("Assignment saved successfully!");
    } catch (error) {
      console.error("Error saving assignment:", error.response?.data || error.message);
    
      toast.error("Failed to save assignment. Please try again.");}
  };

  const startEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setNewAssignment({
      title: assignment.title,
      class: assignment.class,
      dueDate: assignment.dueDate,
      status: assignment.status,
      submitted: assignment.submitted,
      total: assignment.total,
      file: null,
    });
    setIsEditing(true);
    setShowForm(true);
    toast.info("Editing assignment. Make your changes and save.")
  };

  const viewSubmissions = async (assignment) => {
    try {
      const response = await axios.get(
        `https://homeschool2.onrender.com/Hub/assignments/${assignment.id}/submissions/`
      );
      setSubmissions(response.data);
      setSelectedAssignment(assignment);
      setShowSubmissionsModal(true);
      toast.info("Fetched submissions successfully.");
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
          <p className="text-slate-600 mt-1">
            Create and manage assignments for your classes
          </p>
        </div>
        <button
          onClick={() => {
            setIsEditing(false);
            setSelectedAssignment(null);
            setShowForm(true);
          }}
          className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
        >
          Create Assignment
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded-xl shadow-md border space-y-4 text-black">
          <input
            type="text"
            name="title"
            placeholder="Assignment Title"
            value={newAssignment.title}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
          />
          <input
            type="text"
            name="class"
            placeholder="Class Name"
            value={newAssignment.class}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
          />
          <input
            type="date"
            name="dueDate"
            value={newAssignment.dueDate}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
          />
          <select
            name="status"
            value={newAssignment.status}
            onChange={handleChange}
            className="border p-2 rounded-md w-full"
          >
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
          </select>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="border p-2 rounded-md w-full"
          />

          <div className="flex justify-end gap-2 text-black">
            <button
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              {isEditing ? "Update Assignment" : "Save Assignment"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4  text-black">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white rounded-xl shadow-sm p-4 flex justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{assignment.title}</h2>
              <p className="text-sm">{assignment.class}</p>
              <p className="text-sm text-slate-600">
                Due: {assignment.dueDate}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => viewSubmissions(assignment)}
                className="px-3 py-1 text-sm rounded-md bg-yellow-500 text-white"
              >
                View Submissions
              </button>
              <button
                onClick={() => startEdit(assignment)}
                className="px-3 py-1 text-sm rounded-md bg-black text-white"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {showSubmissionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 text-black">
          <div className="bg-white p-6 rounded-lg w-2/3">
            <h2 className="text-xl font-bold mb-4">
              Submissions for {selectedAssignment?.title}
            </h2>
            {submissions.length > 0 ? (
              <ul>
                {submissions.map((s) => (
                  <li key={s.id} className="flex justify-between border p-2 mb-2">
                    <span>{s.student_name || "Student"}</span>
                    <a
                      href={`https://homeschool2.onrender.com${s.file}`}
                      className="text-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No submissions yet</p>
            )}
            <button
              onClick={() => setShowSubmissionsModal(false)}
              className="mt-4 px-4 py-2 bg-gray-300 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
