import React, { useState ,useContext} from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function PrincipalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser,scheduleLogout } = useContext(AuthContext); 

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await Axios.post("https://homeschool2.onrender.com/Hub/principallogin/", {
      Email: email,
      Password: password,
    });

    const { user, access, refresh } = response.data;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("role", "1");
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
    scheduleLogout(access); 

    toast.success("Login successful!");
    navigate("/pages/principal");
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    toast.error("Login failed. Please check your credentials.");
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
           <div className="flex justify-center gap-6 mb-6 text-gray-400">
                      <Link to="/" className=" hover:underline font-medium">
                        Home 
                      </Link>
                      <Link to="/pages/principallogin" className=" hover:underline font-medium">
                        Principal 
                      </Link>
                      <Link to="/pages/teacherlogin" className=" hover:underline font-medium">
                        Teacher 
                      </Link>
                      <Link to="/pages/studentlogin" className=" hover:underline font-medium">
                        Student 
                      </Link>
                    </div>
          <h2 className="mt-10 text-center text-3xl/9 font-bold tracking-tight text-[#ffc01d]">
            Sign in to your account
          </h2> 
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-[#ffc01d]">
            Principal Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email
              </label>
              <div className="mt-4">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

export default PrincipalLogin;
