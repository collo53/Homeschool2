import React, { useState, useEffect } from "react";

const EventModal = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    type: "Meeting",
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold text-black">{event ? "Edit Event" : "Add Event"}</h2>
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded text-black" />
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border p-2 rounded text-black" />
        <input name="time" value={formData.time} onChange={handleChange} placeholder="Time" className="w-full border p-2 rounded text-black" />
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full border p-2 rounded text-black" />
        <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded text-black">
          <option>Meeting</option>
          <option>Event</option>
          <option>Official</option>
          <option>Internal</option>
        </select>
        <div className="flex justify-end gap-2 pt-2 text-black">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
