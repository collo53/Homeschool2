import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBook, FaEdit, FaSave, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";

export default function TeacherClassesHero() {
  const [teacherId, setTeacherId] = useState(null);
  const [unit, setUnit] = useState("");
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({
    unit: "",
    day: "",
    start_time: "",
    end_time: "",
  });
  const [editingLesson, setEditingLesson] = useState(null);
  const [editData, setEditData] = useState({ day: "", start_time: "", end_time: "" });

  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacher");
    if (storedTeacher) {
      try {
        const teacherData = JSON.parse(storedTeacher);
        setTeacherId(teacherData.id);
        if (teacherData.Unit) {
          setUnit(teacherData.Unit);
          setNewLesson((prev) => ({ ...prev, unit: teacherData.Unit }));
        }
      } catch (error) {
        console.error("Error parsing teacher from localStorage:", error);
      }
    }
  }, []);

  const fetchLessons = async () => {
    if (teacherId) {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/Hub/get-lessons/${teacherId}/`);
        setLessons(res.data);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      }
    }
  };

  useEffect(() => {
    fetchLessons();

  }, [teacherId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { teacher: teacherId, ...newLesson };

    try {
      await axios.post("http://127.0.0.1:8000/Hub/addcourse-schedule/", payload);
      toast("Lesson created successfully!");
      fetchLessons();
    } catch (error) {
      console.error("Error saving lesson:", error.response?.data || error);
      toast.error("Failed to create lesson. Please try again.");
    }
  };

  const startEdit = (lesson) => {
    setEditingLesson(lesson.id);
    setEditData({
      day: lesson.day,
      start_time: lesson.start_time,
      end_time: lesson.end_time,
    });
  };

  const saveEdit = async (lessonId) => {
    try {
      await axios.put(`http://127.0.0.1:8000/Hub/update-lesson/${lessonId}/`, editData);
      toast("Lesson updated successfully!");
      fetchLessons();
      setEditingLesson(null);
    } catch (error) {
      console.error("Error updating lesson:", error.response?.data || error);
      toast.error("Failed to update lesson. Please try again.");
    }
  };

  const toggleCompletion = async (lessonId, isCompleted) => {
    try {
      await axios.put(`http://127.0.0.1:8000/Hub/update-lesson/${lessonId}/`, {
        is_completed: isCompleted,
      });
      fetchLessons();
      toast("Lesson status updated!");
    } catch (error) {
      console.error("Error marking lesson completed:", error.response?.data || error);
      toast.error("Failed to update lesson status. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-6 text-black">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Create New Lesson</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={newLesson.unit}
            onChange={(e) => setNewLesson({ ...newLesson, unit: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">Select Unit</option>
            {unit && <option value={unit}>{unit}</option>}
          </select>

          <select
            value={newLesson.day || ""}
            onChange={(e) => setNewLesson({ ...newLesson, day: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">Select Day</option>
            <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
            <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
          </select>

          <input
            type="time"
            value={newLesson.start_time}
            onChange={(e) => setNewLesson({ ...newLesson, start_time: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="time"
            value={newLesson.end_time}
            onChange={(e) => setNewLesson({ ...newLesson, end_time: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />

          <button type="submit" className="mt-4 w-full bg-[#ffc01d] px-4 py-2 rounded-md hover:bg-black hover:text-white">
            Save Lesson
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">My Scheduled Lessons</h3>
        {lessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaBook className="text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold">{lesson.unit}</h2>
                      <p className="text-sm text-slate-600">{lesson.day}</p>
                    </div>
                  </div>
                  {editingLesson === lesson.id ? (
                    <button onClick={() => saveEdit(lesson.id)} className="text-green-600">
                      <FaSave />
                    </button>
                  ) : (
                    <button onClick={() => startEdit(lesson)} className="text-blue-600">
                      <FaEdit />
                    </button>
                  )}
                </div>

                {editingLesson === lesson.id ? (
                  <div className="space-y-2 text-sm">
                    <select
                      value={editData.day}
                      onChange={(e) => setEditData({ ...editData, day: e.target.value })}
                      className="border p-2 rounded w-full"
                    >
                      <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
                      <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
                    </select>
                    <input
                      type="time"
                      value={editData.start_time}
                      onChange={(e) => setEditData({ ...editData, start_time: e.target.value })}
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="time"
                      value={editData.end_time}
                      onChange={(e) => setEditData({ ...editData, end_time: e.target.value })}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Start:</span><span>{lesson.start_time}</span></div>
                    <div className="flex justify-between"><span>End:</span><span>{lesson.end_time}</span></div>
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={lesson.is_completed}
                    onChange={(e) => toggleCompletion(lesson.id, e.target.checked)}
                  />
                  <span className={lesson.is_completed ? "text-green-600 font-semibold" : "text-gray-600"}>
                    {lesson.is_completed ? (
                      <span className="flex items-center gap-1"><FaCheckCircle /> Completed</span>
                    ) : "Mark as Completed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No lessons scheduled yet.</p>
        )}
      </div>
    </div>
  );
}
