import { useState, useEffect } from 'react';
import { FaUser, FaSearch } from 'react-icons/fa';
import axios from 'axios';

export default function TeacherStudentsHero({ teacher }) {
  const [assignedStudents, setAssignedStudents] = useState([]);

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {

        const response = await axios.get(`http://localhost:8000/Hub/getstudentsforteacher/${teacher.id}/`);
        setAssignedStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students for teacher:", error);
      }
    };

    if (teacher?.id) {
      fetchAssignedStudents();
    }
  }, [teacher]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Students</h1>
          <p className="text-slate-600 mt-1">View and manage students across all your classes</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search students..."
            className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedStudents.length > 0 ? assignedStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#ffc01d] flex items-center justify-center">
                  <FaUser className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{student.name}</h2>
                  <p className="text-sm text-slate-600">Grade {student.grade || "N/A"}</p>
                </div>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">
                Active
              </span>
            </div>

            <div className="space-y-2 text-sm">
             
            </div>

           
          </div>
        )) : (
          <p className="text-gray-500">No students assigned yet.</p>
        )}
      </div>
    </div>
  );
}
