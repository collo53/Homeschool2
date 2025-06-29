import React,{useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaUser, FaSearch, FaGraduationCap } from "react-icons/fa";
import AppSidebar from "../components/AppSidebar";
import StudentHero from "../components/studenthero";
import Toggle from "../components/toggle";
import StudentInfo from "../components/studentinfo";
import axios from "axios";




function Students(){
     const [sidebarOpen, setSidebarOpen] = useState(true);
     const [students,setStudents]=useState([]);
    
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/Hub/getstudents/");
      console.log("Fetched students:", response.data);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      
    }
  };
  fetchStudents();
  }, []); 
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
        <div className="pt-12 px-6 ">
          
            <StudentInfo students={students}/>
        </div>
        <div>
           
        </div>
      </div>
    </div>
  );
}
export default Students