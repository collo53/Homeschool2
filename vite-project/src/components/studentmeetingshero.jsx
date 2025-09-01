import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaVideo,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaExternalLinkAlt,
  FaRegPlayCircle,
} from "react-icons/fa";

const StudentMeetingsHero = () => {
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [pastMeetings, setPastMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        const response = await axios.get(
          `http://127.0.0.1:8000/Hub/student/${studentId}/meetings/`
        );

        const now = new Date();
        const upcoming = [];
        const past = [];

      response.data.forEach((meeting) => {
      const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`);
      const endTime = new Date(meetingDateTime.getTime() + meeting.duration * 60000);

     if (now >= meetingDateTime && now <= endTime) {
      meeting.status = "ongoing";   
      upcoming.push(meeting);
    } else if (meetingDateTime >= now) {
      meeting.status = "scheduled";
      upcoming.push(meeting);
    } else {
      meeting.status = "completed";
      past.push(meeting);
}

    });

        setUpcomingMeetings(upcoming);
        setPastMeetings(past);
      } catch (err) {
        console.error("Error fetching meetings:", err);
      }
    };

    fetchMeetings();
  }, []);

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 text-xs rounded font-medium";
    switch (status) {
      case "scheduled":
        return (
          <span className={`${base} bg-blue-100 text-blue-800`}>Scheduled</span>
        );
      case "ongoing":
        return (
          <span className={`${base} bg-green-100 text-green-800`}>Ongoing</span>
        );
      case "completed":
        return (
          <span className={`${base} bg-gray-100 text-gray-800`}>Completed</span>
        );
      default:
        return <span className={`${base} border text-gray-700`}>{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Online Meetings</h1>
        <p className="text-gray-600 mt-2">
          Join virtual classes, study groups, and academic discussions.
        </p>
      </div>

      {/* Upcoming Meetings */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Upcoming Meetings
        </h2>
        <div className="space-y-4">
          {upcomingMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="border rounded-lg p-6 shadow hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-blue-500">
                    <FaVideo className="text-white text-lg" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg text-black font-semibold">
                          {meeting.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Teacher: {meeting.teacher_name}
                        </p>
                      </div>
                      {getStatusBadge(meeting.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt />
                        {new Date(meeting.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {meeting.time} ({meeting.duration} mins)
                      </span>
                      <span className="flex items-center gap-1">
                        <FaUsers /> Grade {meeting.grade}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 space-y-2 min-w-[150px]">
                  {meeting.description && (
                    <a
                      href={meeting.description}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 text-sm px-3 py-1.5 bg-black text-white rounded transition"
                    >
                      <FaExternalLinkAlt />
                      Join Meeting
                    </a>
                  )}
                
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Meetings */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Past Meetings</h2>
        <div className="space-y-4">
          {pastMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="border rounded-lg p-6 shadow hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-gray-400 opacity-60">
                    <FaVideo className="text-white text-lg" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">
                          {meeting.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Teacher: {meeting.teacher_name}
                        </p>
                      </div>
                      {getStatusBadge(meeting.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt />
                        {new Date(meeting.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {meeting.time} ({meeting.duration} mins)
                      </span>
                      <span className="flex items-center gap-1">
                        <FaUsers /> Grade {meeting.grade}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {meeting.recording && (
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 border text-black bg-[#ffc01d] rounded text-sm hover:bg-gray-100 transition">
                      <FaRegPlayCircle />
                      Watch Recording
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StudentMeetingsHero;
