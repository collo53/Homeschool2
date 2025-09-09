import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function StudentCalendarHero() {
  const [events, setEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTypeColor = (type) => {
    switch (type) {
      case "Meeting":
        return "bg-blue-100 text-blue-800";
      case "Internal":
        return "bg-green-100 text-green-800";
      case "Event":
        return "bg-purple-100 text-purple-800";
      case "Official":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/Hub/getevents/");

        const normalizedEvents = (res.data.events || res.data).map((event, index) => ({
          id: index + 1,
          title: event.Title,
          date: event.Date,
          time: event.Time,
          location: event.Location,
          type: event.Type,
          color: getTypeColor(event.Type),
        }));

        setEvents(normalizedEvents);
        setTodayEvents(res.data.today || []);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
          <p className="text-slate-600 mt-1">
            View school events and appointments
          </p>
        </div>
       
      </div>

      {loading ? (
        <p className="text-center text-slate-500">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-5 border-b border-gray-200 flex items-center gap-2">
                <FaCalendarAlt className="text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Upcoming Events
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {events.length === 0 ? (
                  <p className="text-slate-500 text-sm">No events available</p>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">
                              {event.title}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded ${event.color}`}
                            >
                              {event.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <FaCalendarAlt className="text-xs" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaClock className="text-xs" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-xs" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-5 border-b border-gray-200 flex items-center gap-2">
                <FaClock className="text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Today's Schedule
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {todayEvents.length === 0 ? (
                  <p className="text-sm text-slate-500">No scheduled activities today.</p>
                ) : (
                  todayEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          event.status === "completed"
                            ? "bg-green-500"
                            : event.status === "ongoing"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {event.title}
                        </p>
                        <p className="text-sm text-slate-500">{event.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
