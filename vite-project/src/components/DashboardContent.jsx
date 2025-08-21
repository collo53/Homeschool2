import React, { useEffect, useState } from "react";
import { FaUsers, FaBookOpen, FaEnvelopeOpen } from "react-icons/fa";

function DashboardContent() {
  const [stats, setStats] = useState({
    total_students: 0,
    active_teachers: 0,
    running_lessons: 0,
    notifications: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:8000/Hub/stats/"); 
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();

    
   

  }, []);

  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.total_students}
          icon={<FaUsers className="text-5xl p-3 bg-blue-300 rounded-xl" />}
        />

        <StatCard
          title="Active Teachers"
          value={stats.active_teachers}
          icon={<FaUsers className="text-5xl p-3 bg-blue-300 rounded-xl" />}
        />

        <StatCard
          title="Running Lessons"
          value={stats.running_lessons}
          icon={<FaBookOpen className="text-5xl p-3 bg-blue-300 rounded-xl" />}
        />

        <StatCard
          title="Notifications"
          value={stats.notifications}
          icon={<FaEnvelopeOpen className="text-5xl p-3 bg-blue-300 rounded-xl" />}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow-xl rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-semibold text-gray-800">{title}</h2>
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-gray-700 px-1">{value}</h2>
    </div>
  );
}

export default DashboardContent;
