import React, { useState, useContext } from "react"
import { Key, LogOut } from "lucide-react"
import { AuthContext } from "../pages/AuthContext"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function TeacherAccountHero() {
  const { logout } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    localStorage.clear(); 
    logout();              
    navigate("/pages/teacherlogin"); 
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match!");
      return;
    }

    try {
      const teacherId = localStorage.getItem("teacherId");
      const res = await axios.post(`https://homeschoolhub-sigma.vercel.app/Hub/teachers/${teacherId}/change-password/`, {

        current_password: currentPassword,
        new_password: newPassword,
      });

      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
      toast.error("Failed to update password. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-800">
              <Key className="h-5 w-5 text-slate-600" />
              Security Settings
            </div>

            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border px-3 py-2 mb-3 text-black rounded"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 mb-3 text-black rounded"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border px-3 py-2 mb-3 text-black rounded"
            />

            <button
              onClick={handlePasswordUpdate}
              className="bg-black text-white px-4 py-2 rounded hover:bg-[#ffc01d] hover:text-black transition"
            >
              Update Password
            </button>

            {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
          </div>
        </div>

        <div>
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
