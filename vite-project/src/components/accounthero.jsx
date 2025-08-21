import React, { useState, useContext } from "react";
import axios from "axios";
import { Mail, Key, LogOut } from "lucide-react";
import { AuthContext } from "../pages/AuthContext"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AccountHero() {
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { logout } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  const handleEmailChange = async () => {
    if (!oldEmail || !newEmail) {
      alert("Please enter both current and new email.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/Hub/update-email/", {
        old_email: oldEmail,
        new_email: newEmail,
      });
      toast.success(" Email updated successfully!");

    } catch (error) {
      console.error("Email update error:", error);
          toast.error("Failed to update email. Try again.");
    }
  };

  const handlePasswordChange = async () => {
    if (!newEmail || !currentPassword || !newPassword || !confirmPassword) {
      toast.error(" Please fill in all the fields!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/Hub/update-password/", {
        email: newEmail,
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success("Passwords updated successfully !");
    } catch (error) {
      console.error("Password update error:", error);
        toast.error("Failed to update password.");

    }
  };

  const handleLogout = () => {
    localStorage.clear(); 
    logout();              
    navigate("/pages/principallogin"); 
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
      <p className="text-slate-600">Update your email or password and log out.</p>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-800">
          <Mail className="h-5 w-5 text-slate-600" />
          Update Email
        </div>

        <label className="block text-sm font-medium text-slate-700 mb-1">Current Email</label>
        <input
          type="email"
          value={oldEmail}
          onChange={(e) => setOldEmail(e.target.value)}
          className="mb-4 w-full text-black border border-gray-300 px-3 py-2 rounded-md"
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">New Email</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="mb-4 w-full text-black border border-gray-300 px-3 py-2 rounded-md"
        />

        <button
          onClick={handleEmailChange}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Email
        </button>
      </div>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-800">
          <Key className="h-5 w-5 text-slate-600" />
          Change Password
        </div>

        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="mb-4 w-full text-black border border-gray-300 px-3 py-2 rounded-md"
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mb-4 w-full border text-black border-gray-300 px-3 py-2 rounded-md"
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-4 w-full border border-gray-300 px-3 py-2 text-black rounded-md"
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-6 w-full border text-black border-gray-300 px-3 py-2 rounded-md"
        />

        <button
          onClick={handlePasswordChange}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </div>

      <div className="text-right">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
