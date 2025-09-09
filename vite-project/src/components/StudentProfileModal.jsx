import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";


function StudentProfileModal({ student, onClose, setStudents }) {
  const [teacherName, setTeacherName] = useState("");

 useEffect(() => {
  if (!student || !student.id) return;

  axios
    .get(`https://homeschoolhub-sigma.vercel.app/Hub/getteacherforstudent/${student.id}/`)
    .then((res) => {
      setTeacherName(res.data.teacher || "None");
    })
    .catch(() => setTeacherName("Error loading teacher"));
}, [student]);



const handleDeleteStudent = async () => {
  if (!student?.id) {
    alert("No student selected");
    return;
  }

  try {
    await axios.delete(`https://homeschoolhub-sigma.vercel.app/Hub/delete-student/${student.id}/`);

    const updated = await axios.get("https://homeschoolhub-sigma.vercel.app/Hub/getstudents/");
    setStudents(updated.data);

      toast.success(" Student deleted successfully!");
    onClose();
  } catch (error) {
    console.error("Delete error:", error.response?.data || error.message);
      toast.error(" Error deleting student");
  }
};






  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-black">Student Profile</h2>

        <div className="space-y-2 text-black">
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Grade:</strong> {student.grade}</p>
          <p><strong>Status:</strong> {student.status}</p>
          <p><strong>Courses:</strong> {student.courses}</p>
          <p><strong>Assigned Teacher:</strong> {teacherName}</p>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleDeleteStudent}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Student
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentProfileModal;
