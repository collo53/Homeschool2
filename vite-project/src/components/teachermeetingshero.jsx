import { useState,useEffect } from "react"
import { FaPlus, FaCalendarAlt, FaClock, FaUsers, FaVideo, FaEdit, FaTrash } from "react-icons/fa"
import { format } from "date-fns"
import axios from "axios"
import { toast } from "react-toastify"
const initialMeetings = []

export default function TeacherMeetingsHero() {
  const [meetings, setMeetings] = useState(initialMeetings)
  const [isOpen, setIsOpen] = useState(false)
  const [editingMeetingId, setEditingMeetingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "30",
    grade: "",   
  })
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const teacherId = localStorage.getItem("teacherId")
        if (!teacherId) return

        const res = await axios.get("https://homeschool2.onrender.com/Hub/meetings/", {
          params: { teacher: teacherId },
        })
        setMeetings(res.data)
      } catch (error) {
        console.error("Error fetching meetings:", error.response?.data || error)
      }
    }

    fetchMeetings()
  }, [])
  const handleSubmit = async () => {
  if (!formData.title || !formData.date || !formData.time || !formData.grade) return;

  try {
    const teacherId = localStorage.getItem("teacherId");

    if (editingMeetingId) {
      const res = await axios.put(
        `https://homeschool2.onrender.com/Hub/meetings/${editingMeetingId}/update/`,
        {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          duration: parseInt(formData.duration),
          grade: formData.grade,
          status: "",
          teacher: teacherId,
        }
      );

      setMeetings(meetings.map(m => (m.id === editingMeetingId ? res.data : m)));
      setEditingMeetingId(null);
      toast.success("Meeting updated successfully!");
    } else {
      const res = await axios.post(
        "https://homeschool2.onrender.com/Hub/meetings/create/",
        {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          duration: parseInt(formData.duration),
          grade: formData.grade,
          status: "scheduled",
          teacher: teacherId,
        }
      );

      setMeetings([...meetings, res.data]);
      toast.success("Meeting created successfully!");
    }

    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "30",
      grade: "scheduled",
    });
    setIsOpen(false);

  } catch (error) {
    console.error("Error saving meeting:", error.response?.data || error);
    toast.error("Failed to save meeting. Please try again.");

  }
};

const handleDelete = async (id) => {
  try {
    await axios.delete(`https://homeschool2.onrender.com/Hub/meetings/${id}/delete/`);
    setMeetings(meetings.filter(m => m.id !== id));
    toast.success("Meeting deleted successfully!");
  } catch (error) {
    console.error("Error deleting meeting:", error.response?.data || error);
    toast.error("Failed to delete meeting. Please try again.");
  }
};


  const getStatusColor = (status) => {
    return status === "scheduled"
      ? "bg-blue-100 text-blue-700"
      : status === "ongoing"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700"
  }
const getMeetingStatus = (meeting) => {
  const start = new Date(`${meeting.date}T${meeting.time}`);
  const end = new Date(start.getTime() + meeting.duration * 60000);
  const now = new Date();

  if (now < start) return "scheduled";
  if (now >= start && now <= end) return "ongoing";
  return "done";
};
const updatedMeetings = meetings.map(m => ({
  ...m,
  status: getMeetingStatus(m),
}));

const todayMeetings = meetings
  .map(m => ({ ...m, status: getMeetingStatus(m) }))
  .filter(m => new Date(m.date).toDateString() === new Date().toDateString());

const upcomingMeetings = meetings
  .map(m => ({ ...m, status: getMeetingStatus(m) }))
  .filter(m => m.status === "scheduled");

  const openMeeting = (meeting) => {
  if (meeting.description && meeting.description.startsWith("http")) {
    window.open(meeting.description, "_blank");
  } else {
    alert("No valid meeting link found in description.");
  }
};
useEffect(() => {
  const interval = setInterval(() => {
    setMeetings(prev =>
      prev.map(m => ({ ...m, status: getMeetingStatus(m) }))
    );
  }, 60000); 

  return () => clearInterval(interval);
}, []);


  return (
    <div className="p-6 space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Online Meetings</h1>
          <p className="text-gray-600 mt-1">Schedule and manage your virtual meetings</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#ffc01d] text-black px-4 py-2 rounded hover:bg-black hover:text-white"
        >
          <FaPlus /> Schedule Meeting
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 text-gray">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4 relative">
            <h2 className="text-xl font-semibold text-gray-900">Schedule New Meeting</h2>

            <input
              type="text"
              placeholder="Meeting Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border px-3 py-2 text-black rounded"
            />

            <textarea
              placeholder="link to meeting (e.g., Zoom/Google Meet)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border px-3 py-2 text-black rounded"
              rows={2}
            />

            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border px-3 text-black py-2 rounded"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full border px-3 text-black py-2 rounded"
              />
              <input
                type="number"
                min="15"
                max="180"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full border px-3 py-2 text-black rounded"
                placeholder="Duration (minutes)"
              />
            </div>

            <input
              type="text"
              placeholder="Grade"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full border px-3 py-2 text-black rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800">
              <FaVideo /> Upcoming Meetings
            </h3>
            {upcomingMeetings.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No upcoming meetings scheduled.</p>
            ) : (
              upcomingMeetings.map(meeting => (
                <div key={meeting.id} className="border p-4 rounded mb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">{meeting.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{meeting.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><FaCalendarAlt /> {format(new Date(meeting.date), "PPP")}</span>
                        <span className="flex items-center gap-1"><FaClock /> {meeting.time} ({meeting.duration} mins)</span>
                        <span className="flex items-center gap-1">Grade: {meeting.grade}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => openMeeting(meeting)}
                        className="px-3 py-1 text-white bg-black rounded hover:text-black flex items-center gap-1 text-sm">
                          <FaVideo /> Join
                        </button>
                       <button
                        onClick={() => {
                          setFormData({
                            title: meeting.title,
                            description: meeting.description,
                            date: meeting.date,
                            time: meeting.time,
                            duration: meeting.duration.toString(),
                            grade: meeting.grade,
                          });
                          setEditingMeetingId(meeting.id);
                          setIsOpen(true);
                        }}
                        className="px-3 py-1 border rounded bg-[#ffc01d] text-black hover:text-white text-sm flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>

                        <button 
                          onClick={() => handleDelete(meeting.id)}
                        className="px-3 py-1 border rounded text-sm flex items-center gap-1 text-red-600">
                          <FaTrash /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800">
              <FaClock /> Today’s Meetings
            </h3>
            {todayMeetings.length === 0 ? (
              <p className="text-center text-gray-500">No meetings today</p>
            ) : (
              todayMeetings.map(m => (
                <div key={m.id} className="p-3 bg-gray-50 rounded mb-3">
                  <h4 className="font-medium text-gray-900">{m.title}</h4>
                  <p className="text-sm text-gray-600">{m.time}</p>
                  <p className="text-sm text-gray-600">Grade: {m.grade}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => openMeeting(m)}
                     className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-green-700">
                      Join Now
                    </button>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(m.status)}`}>
                      {m.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
