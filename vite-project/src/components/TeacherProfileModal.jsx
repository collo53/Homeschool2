import React, { useState } from "react";

function TeacherProfileModal({ teacher, onClose, setTeachers }) {
  const [assignedStudents, setAssignedStudents] = useState(
    Array.isArray(teacher.students) ? teacher.students : []
  );
  const [studentName, setStudentName] = useState("");

  const handleAddStudent = () => {
    const trimmed = studentName.trim();
    if (trimmed && !assignedStudents.includes(trimmed)) {
      setAssignedStudents([...assignedStudents, trimmed]);
      setStudentName("");
    }
  };

  const handleRemoveStudent = (name) => {
    setAssignedStudents(assignedStudents.filter((s) => s !== name));
  };

  const handleSave = () => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === teacher.id ? { ...t, students: assignedStudents } : t
      )
    );
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

        <h2 className="text-2xl font-semibold mb-4 text-black">Teacher Profile</h2>

        <div className="text-black space-y-2 mb-4">
          <p><strong>Name:</strong> {teacher.Name}</p>
          <p><strong>Email:</strong> {teacher.Email}</p>
          <p><strong>Subject:</strong> {teacher.Unit}</p>
          <p><strong>Status:</strong> {teacher.status}</p>
        </div>

        <div className="mb-4">
          <label className="block text-black mb-1">Add Student Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="border p-2 rounded w-full text-black"
              placeholder="Enter student name"
            />
            <button
              onClick={handleAddStudent}
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
              type="button"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-black mb-1">
            Assigned Students ({assignedStudents.length}):
          </label>

          {assignedStudents.length === 0 ? (
            <p className="text-gray-500">No students assigned yet</p>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {assignedStudents.map((student, index) => (
                <li key={index} className="flex justify-between items-center text-black">
                  {student}
                  <button
                    onClick={() => handleRemoveStudent(student)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleSave}
          className="bg-[#ffc01d] text-white px-4 py-2 rounded hover:bg-yellow-500"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default TeacherProfileModal;
