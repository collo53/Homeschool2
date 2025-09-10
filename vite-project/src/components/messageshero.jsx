import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEnvelope,
  FaClock,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import ComposeMessageModal from "../components/ComposeMessageModal";

export default function MessagesHero() {
  const [messages, setMessages] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null); // for viewing

  const formatPriority = (status) => status.toLowerCase();

  const sortMessagesByPriority = (messages) => {
    const priorityOrder = { high: 1, moderate: 2, low: 3 };
    return [...messages].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  };

  const generateRecentContacts = (msgs) => {
    const uniqueMap = new Map();

    msgs.forEach((msg) => {
      const name = msg.Receiver || msg.receiver || "Unknown";
      if (!uniqueMap.has(name)) {
        uniqueMap.set(name, {
          name,
          lastContact: new Date(msg.DateSent).toLocaleString(),
        });
      }
    });

    return Array.from(uniqueMap.values());
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get("https://homeschool2.onrender.com/Hub/getmessages/");
      const formatted = response.data.map((msg) => ({
        id: msg.id || Date.now(),
        from: msg.Sender,
        receiver: msg.Receiver,
        subject: msg.Subject,
        preview: msg.Message,
        fullMessage: msg.Message, // full content
        time: new Date(msg.DateSent).toLocaleString(),
        unread: true,
        priority: formatPriority(msg.Status),
        DateSent: msg.DateSent,
      }));

      setMessages(sortMessagesByPriority(formatted));
      setRecentContacts(generateRecentContacts(response.data));
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSendMessage = (newMsg) => {
    const message = {
      id: Date.now(),
      from: newMsg.sender,
      receiver: newMsg.recipient,
      subject: newMsg.subject,
      preview: newMsg.message,
      fullMessage: newMsg.message,
      time: "Just now",
      unread: true,
      priority: newMsg.priority.toLowerCase(),
    };

    setMessages((prev) => sortMessagesByPriority([message, ...prev]));

    setRecentContacts((prev) => {
      const exists = prev.find((c) => c.name === newMsg.recipient);
      if (!exists) {
        return [
          { name: newMsg.recipient, lastContact: "Just now" },
          ...prev,
        ];
      }
      return prev;
    });
  };

  return (
    <div className="p-6 space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
          <p className="text-slate-600 mt-1">
            Communicate with staff, parents, and students
          </p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Compose
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search messages..."
            className="pl-10 pr-4 text-black py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inbox */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="p-4 border-b flex items-center gap-2 text-slate-700 font-semibold text-lg">
              <FaEnvelope />
              Inbox
            </div>
            <div className="p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)} // 👈 Open message
                  className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                    message.unread
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={`font-semibold truncate ${
                            message.unread
                              ? "text-slate-900"
                              : "text-slate-700"
                          }`}
                        >
                          {message.from}
                        </p>
                        {message.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            message.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : message.priority === "moderate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {message.priority}
                        </span>
                      </div>
                      <p
                        className={`font-medium mb-1 truncate ${
                          message.unread
                            ? "text-slate-900"
                            : "text-slate-700"
                        }`}
                      >
                        {message.subject}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {message.preview}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 ml-4">
                      <FaClock className="h-3 w-3" />
                      <span>{message.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Contacts */}
        <div>
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="p-4 border-b flex items-center gap-2 text-slate-700 font-semibold text-lg">
              <FaUser />
              Recent Contacts
            </div>
            <div className="p-4 space-y-3">
              {recentContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <FaUser className="text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">
                        {contact.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {contact.lastContact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <ComposeMessageModal
          onClose={() => setShowCompose(false)}
          onSend={handleSendMessage}
        />
      )}

      {selectedMessage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedMessage.subject}</h2>
            <p className="text-sm text-slate-500 mb-4">
              From: {selectedMessage.from} | To: {selectedMessage.receiver}
            </p>
            <p className="text-slate-700 whitespace-pre-line">
              {selectedMessage.fullMessage}
            </p>
            <p className="mt-4 text-xs text-slate-500">{selectedMessage.time}</p>
          </div>
        </div>
      )}
    </div>
  );
}
