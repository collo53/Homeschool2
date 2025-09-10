import React, { useEffect, useState } from "react";
import { FaSearch, FaShieldAlt, FaClock, FaUser, FaFileAlt } from "react-icons/fa";

export default function AuditLogs() {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("https://homeschool2.onrender.com/Hub/activities/");
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 10000); 
    return () => clearInterval(interval);
  }, []);

  const filteredActivities = activities.filter(
    (activity) =>
      activity.user.toLowerCase().includes(search.toLowerCase()) ||
      activity.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Audit Logs</h1>
          <p className="text-slate-600 mt-1">Monitor system activities and security events</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm p-4 h-[700px] overflow-y-auto">
        <div className="p-4 border-b flex items-center gap-2 text-lg font-semibold text-slate-900">
          <FaShieldAlt className="mr-2" /> System Activity Log
        </div>
        <ul className="space-y-4 mt-4">
          {filteredActivities.slice(0, 15).map((activity, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-200 text-blue-800 flex items-center justify-center rounded-full font-bold text-lg">
                {activity.user.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
