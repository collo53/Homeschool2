import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import axios from "axios";
import EventModal from "../components/EventModal";

const CalendarHero = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const typeToColor = {
    Meeting: "bg-blue-100 text-blue-800",
    Event: "bg-green-100 text-green-800",
    Official: "bg-purple-100 text-purple-800",
    Internal: "bg-yellow-100 text-yellow-800",
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://homeschoolhub-sigma.vercel.app/Hub/getevents/");
        const fetchedEvents = response.data.map(event => ({
          id: event.id,
          title: event.Title,
          date: event.Date,
          time: event.Time,
          location: event.Location,
          type: event.Type,
          color: typeToColor[event.Type] || "bg-gray-100 text-gray-800",
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleAdd = () => {
    setEditEvent(null);
    setModalOpen(true);
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    setModalOpen(true);
  };

  const handleSave = (newEvent) => {
    const color = typeToColor[newEvent.type] || "bg-gray-100 text-gray-800";

    if (editEvent) {
      setEvents(events.map(e =>
        e.id === editEvent.id ? { ...newEvent, id: editEvent.id, color } : e
      ));
    } else {
      setEvents([...events, { ...newEvent, id: Date.now(), color }]);
    }

    setModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
          <p className="text-slate-600 mt-1">Manage school events and appointments</p>
        </div>
        <button onClick={handleAdd} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
          <FaPlus className="mr-2" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-5 border-b border-gray-200 flex items-center gap-2">
              <FaCalendarAlt className="text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">Upcoming Events</h2>
            </div>
            <div className="p-5 space-y-4">
              {events.map(event => (
                <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{event.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${event.color}`}>
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
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-sm text-black border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-5 border-b border-gray-200 flex items-center gap-2">
              <FaClock className="text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">Today's Schedule</h2>
            </div>
            <div className="p-5 space-y-4">
              {events
                .filter(e => e.date === new Date().toISOString().split("T")[0])
                .map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{event.title}</p>
                      <p className="text-sm text-slate-500">{event.time}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <EventModal
          event={editEvent}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default CalendarHero;
