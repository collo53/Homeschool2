import React, { useState, useContext } from "react"
import { Key, LogOut } from "lucide-react"
import { AuthContext } from "../pages/AuthContext"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function StudentAccountHero() {

   const { logout } = useContext(AuthContext); 
    const navigate = useNavigate(); 
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

    const handleLogout = () => {
    localStorage.clear(); 
    logout();              
    navigate("/pages/studentlogin"); 
  };

  const handlePasswordUpdate = async () => {
  if (newPassword !== confirmPassword) {
    setMessage("New passwords do not match!");
    return;
  }

  try {
    const studentId = localStorage.getItem("studentId"); 
    const res = await axios.post(
      `https://homeschool2.onrender.com/Hub/student/${studentId}/change-password/`,
      {
        current_password: currentPassword,
        new_password: newPassword,
      },
        { headers: { "Content-Type": "application/json" } } // important

    );

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
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-slate-600 mt-1">Manage your profile and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
         

          <div className="border rounded-lg p-6 bg-white shadow-sm text-black">
            <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-800">
              <Key className="h-5 w-5 text-slate-600" />
              Security Settings
            </div>

           <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}                  // ✅ bind state
                onChange={(e) => setCurrentPassword(e.target.value)} // ✅ update state
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>


            <hr className="my-6" />

           

            <button 
            onClick={handlePasswordUpdate}
            className="bg-black text-white px-4 py-2 rounded hover:bg-[#ffc01d] hover:text-black transition">Update Password</button>
             {message && <p className="mt-3 text-sm text-red-600">{message}</p>}

          </div>
        </div>

        <div>
          <div className="border rounded-lg p-6 bg-white shadow-sm">
           

            <button
            onClick={handleLogout}
             className="mt-6 border border-slate-300 w-full text-black py-2 rounded hover:text-red-500 transition">Logout</button>
          </div>
        </div>
      </div>
    </div>
  )
}
