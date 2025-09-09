import React, { useState, useEffect } from "react";
import axios from "axios";

function TeacherProfileModal({ teacher, onClose, setTeachers }) {
  const [assignedStudents, setAssignedStudents] = useState(
    Array.isArray(teacher.students) ? teacher.students : []
  );
  const [allStudents, setAllStudents] = useState([]); // students from backend
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("https://homeschoolhub-sigma.vercel.app/Hub/getstudents/");
        setAllStudents(response.data); // should return list of {id, name, grade}
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleAddStudent = () => {
    if (selectedStudent && !assignedStudents.includes(selectedStudent)) {
      setAssignedStudents([...assignedStudents, selectedStudent]);
      setSelectedStudent("");
    }
  };

  const handleRemoveStudent = (name) => {
    setAssignedStudents(assignedStudents.filter((s) => s !== name));
  };

  const handleSave = async () => {
    try {
      await axios.post("https://homeschoolhub-sigma.vercel.app/Hub/assign-students/", {
        teacher_id: teacher.id,
        students: assignedStudents, 
      });

      setTeachers((prev) =>
        prev.map((t) =>
          t.id === teacher.id ? { ...t, students: assignedStudents } : t
        )

      );


      onClose();

    } catch (error) {
      console.error("Error saving students:", error);
    }
  };

  const handleDeleteTeacher = async () => {
  if (!window.confirm(`Are you sure you want to delete ${teacher.Name}?`)) return;

  try {
    await axios.delete(`https://homeschoolhub-sigma.vercel.app/Hub/delete-teacher/${teacher.id}/`);
    
    setTeachers((prev) => prev.filter((t) => t.id !== teacher.id));

    onClose();
  } catch (error) {
    console.error("Error deleting teacher:", error);
    alert("Failed to delete teacher.");
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

        <h2 className="text-2xl font-semibold mb-4 text-black">Teacher Profile</h2>

        <div className="text-black space-y-2 mb-4">
          <p><strong>Name:</strong> {teacher.Name}</p>
          <p><strong>Email:</strong> {teacher.Email}</p>
          <p><strong>Subject:</strong> {teacher.Unit}</p>
          <p><strong>Status:</strong> {teacher.status}</p>
        </div>

        {/* Dropdown for assigning student */}
        <div className="mb-4">
          <label className="block text-black mb-1">Assign Student</label>
          <div className="flex gap-2">
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="border p-2 rounded w-full text-black"
            >
              <option value="">-- Select Student --</option>
              {allStudents.map((student) => (
                <option key={student.id} value={student.name}>
                  {student.name} ({student.grade})
                </option>
              ))}
            </select>
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

       <div className="flex justify-between mt-4">
  <button
    onClick={handleSave}
    className="bg-[#ffc01d] text-white px-4 py-2 rounded hover:bg-yellow-500"
  >
    Save
  </button>

  <button
    onClick={handleDeleteTeacher}
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
  >
    Delete Teacher
  </button>
</div>

      </div>
    </div>
  );
}

export default TeacherProfileModal;
