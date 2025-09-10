import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";


function AddTeacherModal({ onClose, setTeachers }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    teacherNumber: "",
    password: "",
    subject: "",
    gradeLevel: "",
    startDate: "",
  });

  const [courses, setCourses] = useState([]); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://homeschool2.onrender.com/Hub/getcourses/");
        console.log("Courses API response:", response.data); 

        setCourses(response.data); 
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const teacherPayload = {
      Name: formData.fullName,
      Email: formData.email,
      Phone: formData.phone,
      ID_number: formData.idNumber,
      TeacherNumber: formData.teacherNumber,
      Password: formData.password,
      Unit: formData.subject,
      Grade: formData.gradeLevel,
      DateHired: formData.startDate,
    };

    try {
      const response = await fetch("https://homeschool2.onrender.com/Hub/addteacher/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherPayload),
      });

      if (response.ok) {
        const data = await response.json();
        setTeachers((prev) => [...prev, data]);
        toast.success("Teacher added successfully!");

        onClose();
      } else {
        console.error("Failed to save teacher");
      }
    } catch (error) {
      toast.error("Failed to save teacher",error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-black">Add New Teacher</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input name="fullName" type="text" placeholder="Full Name ..." value={formData.fullName} onChange={handleChange} className="border p-2 rounded text-black" required />
          <input name="email" type="email" placeholder="Email Address..." value={formData.email} onChange={handleChange} className="border p-2 rounded text-black" required />
          <input name="phone" type="text" placeholder="Phone Number..." value={formData.phone} onChange={handleChange} className="border p-2 rounded text-black" required />
          <input name="idNumber" type="text" placeholder="ID Number..." value={formData.idNumber} onChange={handleChange} className="border p-2 rounded text-black" required />
          <input name="teacherNumber" type="text" placeholder="Teacher Number..." value={formData.teacherNumber} onChange={handleChange} className="border p-2 rounded text-black" required />

          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="border p-2 rounded bg-white text-black hover:bg-gray-100"
            required
          >
            <option value="">-- Select Subject --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.name} className=" bg-white text-black">
                {course.Name}
              </option>
            ))}
          </select>

          <input name="gradeLevel" type="text" placeholder="Grade Level Assigned..." value={formData.gradeLevel} onChange={handleChange} className="border p-2 rounded text-black" required />
          <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="border p-2 rounded text-black" required />
          <input name="password" type="password" placeholder="Password..." value={formData.password} onChange={handleChange} className="border p-2 rounded text-black" required />

          <button type="submit" className="bg-[#ffc01d] text-white py-2 rounded hover:bg-black hover:text-white">
            Save Teacher
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTeacherModal;
