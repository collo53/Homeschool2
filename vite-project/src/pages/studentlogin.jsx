import React, { useState ,useContext } from "react";
import Axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/AuthContext";
import { toast } from "react-toastify";



function StudentLogin() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await Axios.post("http://127.0.0.1:8000/Hub/studentlogin/", {
      studentNumber: text,
      Password: password,
    });

    if (response.data.student) {
      setUser(response.data.student);

      localStorage.setItem("student", JSON.stringify(response.data.student));
      localStorage.setItem("studentId", response.data.student.id); 
      localStorage.setItem("studentNumber", response.data.student.studentNumber); 
      console.log("Logged in student:", response.data.student);

      toast.success("Login successful!");
      navigate("/pages/studentmain");
    } else {
      toast.error("Invalid login. No student returned.");
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    toast.error("Login failed. Check your credentials.");
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          
          
          <h2 className="mt-10 text-center text-3xl/9 font-bold tracking-tight text-[#ffc01d]">
            Sign in to your account
          </h2> 
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-[#ffc01d]">
            Student Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="Number" className="block text-sm/6 font-medium text-gray-900">
                Registration Number
              </label>
              <div className="mt-4">
                <input
                  id="text"
                  name="text"
                  type="text"
                  required
                  autoComplete="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              <div className="mt-4">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#ffc01d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign In
              </button>
            </div>
          </form>

         
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
