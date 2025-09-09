import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  const logout = () => {
    const role = localStorage.getItem("role");
    console.log("Logging out, detected role:", role);

    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("teacher");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("teacherId");
    localStorage.removeItem("teacherNumber");

    if (role === "2") {
      navigate("/pages/teacherlogin");
    } else if (role === "3") {
      navigate("/pages/studentlogin");
    } else {
      navigate("/pages/principallogin");
    }
  };

  const scheduleLogout = (token) => {
    try {
      const decoded = jwtDecode(token);
      const expiry = decoded.exp * 1000;
      const now = Date.now();
      const timeout = expiry - now;

      if (timeout > 0) {
        setTimeout(() => {
          logout();
          toast.info("Session expired. Please log in again.");
        }, timeout);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      logout();
    }
  };

  const isAuthenticated = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return false;

    try {
      const decoded = jwtDecode(accessToken);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    if (storedUser && accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
          setUser(JSON.parse(storedUser));
          scheduleLogout(accessToken);
        } else {
          toast.info("Session expired. Please log in again.");
          logout();
        }
      } catch (error) {
        console.error("Error verifying stored token:", error);
        logout();
      }
    }
    setLoading(false); 
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        scheduleLogout,
        isAuthenticated,
        loading, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
