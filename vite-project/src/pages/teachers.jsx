import React, { useState, useEffect } from 'react';
import AppSidebar from '../components/AppSidebar';
import Toggle from '../components/toggle';
import TeacherHero from '../components/teacherhero';
import TeacherInfo from '../components/teacherinfo';
import TeacherProfileModal from '../components/TeacherProfileModal';

function Teachers() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("https://homeschool2.onrender.com/Hub/getteachers/");
        if (response.ok) {
          const data = await response.json();
          setTeachers(data);
        } else {
          console.error("Failed to fetch teachers");
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []); 

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleViewProfile = (teacher) => {
    setSelectedTeacher(teacher);
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
          <TeacherHero setTeachers={setTeachers} />
          <TeacherInfo teachers={teachers} onViewProfile={handleViewProfile} />
        </div>
      </div>

      {selectedTeacher && (
        <TeacherProfileModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          setTeachers={setTeachers}
        />
      )}
    </div>
  );
}

export default Teachers;
