import React, { useState } from "react";

export default function ComposeMessageModal({ onClose, onSend }) {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (recipient && subject && message) {
      onSend({ recipient, subject, message, time: "Just now", unread: true, priority: "medium" });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
        <h2 className="text-lg font-bold text-slate-900">New Message</h2>
        <input
          type="text"
          placeholder="Recipient (e.g., John Doe)"
          className="w-full border border-gray-300 p-2 rounded text-black"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
       
        <input
          type="text"
          placeholder="Subject"
          className="w-full border border-gray-300 p-2 rounded text-black"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          placeholder="Your message..."
          className="w-full border border-gray-300 p-2 rounded h-32 text-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <select name="type"   className="w-full border p-2 rounded text-black">
          <option>High</option>
          <option>Moderate</option>
          <option>Low</option>
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
