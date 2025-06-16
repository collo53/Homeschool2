import React, { useState } from "react";

function StudentProfileModal({ student, onClose, onAssignTeacher }) {
  const [teacherName, setTeacherName] = useState(student.assignedTeacher || "");

  const handleSave = () => {
    onAssignTeacher(student.id, teacherName);
    onClose();
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
          <p><strong>GPA:</strong> {student.gpa}</p>
          <p><strong>Status:</strong> {student.status}</p>
          <p><strong>Courses:</strong> {student.courses}</p>
          <p><strong>Assigned Teacher:</strong> {student.assignedTeacher || "None"}</p>
        </div>

        <div className="mt-4">
          <label className="block text-black mb-1">Assign Teacher</label>
          <input
            type="text"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            className="w-full p-2 border rounded text-black"
            placeholder="Enter teacher name..."
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default StudentProfileModal;
