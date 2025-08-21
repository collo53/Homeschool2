import React, { useState ,useContext} from "react";
import AppSidebar from "../components/AppSidebar";
import Toggle from "../components/toggle";
import DashboardContent from "../components/DashboardContent";
import DashboardInfo from "../components/DashboardInfo";
import { AuthContext } from "../pages/AuthContext";
import { Navigate } from "react-router-dom";  

function Principal() {
    const { user } = useContext(AuthContext);

  const [sidebarOpen, setSidebarOpen] = useState(true);
 
  if (!user) {
    return <Navigate to="/pages/principallogin" replace />; // redirect if not logged in
  }
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

 
  return (
    <div className="w-screen min-h-screen flex bg-gray-100 relative overflow-hidden">
    
      <Toggle toggleSidebar={toggleSidebar} />

      
      <div
        className={`fixed top-0 left-0 h-screen w-72 bg-black text-white transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar />
      </div>

     
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "pl-72" : "pl-0"}`}>
        <div className="pt-12 px-6">
          <DashboardContent />
          <DashboardInfo />
        </div>
      </div>
    </div>
  );
}

export default Principal;
