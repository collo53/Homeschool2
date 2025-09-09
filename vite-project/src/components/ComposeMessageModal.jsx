import React, { useState} from "react";
import axios from "axios";
import { toast } from "react-toastify";


export default function ComposeMessageModal({ onClose, onSend }) {
  const [formData, setFormData] = useState({
    sender: "",
    recipient: "",
    subject: "",
    message: "",
    priority: "Moderate",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "recipient" && value.length > 1) {
      fetchSuggestions(value);
    } else if (name === "recipient") {
      setSuggestions([]);
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `https://homeschoolhub-sigma.vercel.app/Hub/search-users/?q=${query}`
      );
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = (email) => {
    setFormData((prev) => ({ ...prev, recipient: email }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSend = async () => {
    const newMessage = {
      Sender: formData.sender,
      Receiver: formData.recipient,
      Subject: formData.subject,
      Message: formData.message,
      Status: formData.priority,
    };

    try {
      const response = await axios.post(
        "https://homeschoolhub-sigma.vercel.app/Hub/addmessage/",
        newMessage
      );

      onSend({
        id: Date.now(),
        from: formData.sender,
        subject: formData.subject,
        preview: formData.message,
        time: "Just now",
        unread: true,
        priority: formData.priority.toLowerCase(),
      });

      onClose();
          toast.success(" Messagge sent successfully!");

    } catch (error) {
      console.error(
        "Error sending message",
        error.response?.data || error.message
      );
          toast.error("Failed to send message. Try again.");

    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg relative">
        <h2 className="text-lg font-bold text-slate-900">New Message</h2>

        <input
          name="sender"
          type="text"
          placeholder="Sender (e.g., John Doe)"
          className="w-full border border-gray-300 p-2 rounded text-black"
          value={formData.sender}
          onChange={handleChange}
        />

        <div className="relative">
          <input
            name="recipient"
            type="text"
            placeholder="Recipient (email or name)"
            className="w-full border border-gray-300 p-2 rounded text-black"
            value={formData.recipient}
            onChange={handleChange}
            onFocus={() => formData.recipient && setShowSuggestions(true)}
            autoComplete="off"
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-40 overflow-y-auto shadow">
              {suggestions.map((s, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-100 text-black"
                onClick={() => handleSuggestionClick(s.identifier)}
              >
                {s.name} – {s.type === "student" ? "Reg:" : "Teacher:"} {s.identifier}
              </li>

              ))}
            </ul>
          )}
        </div>

        <input
          name="subject"
          type="text"
          placeholder="Subject"
          className="w-full border border-gray-300 p-2 rounded text-black"
          value={formData.subject}
          onChange={handleChange}
        />

        <textarea
          name="message"
          placeholder="Your message..."
          className="w-full border border-gray-300 p-2 rounded h-32 text-black"
          value={formData.message}
          onChange={handleChange}
        />

        <select
          name="priority"
          value={formData.priority}
          className="w-full border p-2 rounded text-black"
          onChange={handleChange}
        >
          <option>High</option>
          <option>Moderate</option>
          <option>Low</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
