import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './pages/home'; 
import About from './pages/about'; 
import Services from './pages/services';
import Contact from './pages/contact';
import Principal from './pages/Principal';
import Teachers from './pages/teachers';
import Students from './pages/students';
import Courses from './pages/courses';
import Reports from './pages/reports';
import Calendar from './pages/calendar';
import Messages from './pages/messages';
import Account from './pages/account';
import Audit from './pages/audit';
import TeacherMain from './pages/teachermain';
import TeacherMainClasses from './pages/teacherclasses';
import TeacherStudents from './pages/teacherstudents';
import TeacherAssignments from './pages/teacherassignments';
import TeacherGrades from './pages/teachergrades';
import TeacherCalendar from './pages/teachercalendar';
import TeacherMessages from './pages/teachermessages';
import TeacherMeetings from './pages/teachermeetings';
import TeacherAccount from './pages/teacheraccount';
import StudentMain from './pages/studentmain';
import StudentClass from './pages/studentclass';
import StudentLesson from './pages/studentlesson';
import StudentCalendar from './pages/studentcalendar';
import StudentGrades from './pages/studentgrades';
import StudentMeetings from './pages/studentmeetings';
import StudentMessages from './pages/studentmessages';
import StudentAccount from './pages/studentaccount';
import PrincipalLogin from './pages/principallogin';
import StudentLogin from './pages/studentlogin';
import TeacherLogin from './pages/teacherlogin';
import { AuthProvider } from "./pages/AuthContext"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
      <Router>
            <AuthProvider>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pages/about" element={<About />} />
          <Route path="/pages/services" element={<Services />} />
          <Route path="/pages/contact" element={<Contact />} />
          <Route path="/pages/Principal" element={<PrivateRoute><Principal /></PrivateRoute>} />
          <Route path="/pages/teachers" element={<PrivateRoute><Teachers /></PrivateRoute>} />
          <Route path="/pages/students" element={<PrivateRoute><Students /></PrivateRoute>} />
          <Route path="/pages/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
          <Route path="/pages/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/pages/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
          <Route path="/pages/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
          <Route path="/pages/account" element={<PrivateRoute><Account /></PrivateRoute>} />
          <Route path="/pages/audit" element={<PrivateRoute><Audit /></PrivateRoute>} />
          <Route path="/pages/teachermain" element={<PrivateRoute><TeacherMain /></PrivateRoute>} />
          <Route path="/pages/teacherclasses" element={<PrivateRoute><TeacherMainClasses /></PrivateRoute>} />
          <Route path="/pages/teacherstudents" element={<PrivateRoute><TeacherStudents /></PrivateRoute>} />
          <Route path="/pages/teacherassignments" element={<PrivateRoute><TeacherAssignments /></PrivateRoute>} />
          <Route path="/pages/teachergrades" element={<PrivateRoute><TeacherGrades /></PrivateRoute>} />
          <Route path="/pages/teachercalendar" element={<PrivateRoute><TeacherCalendar /></PrivateRoute>} />
          <Route path="/pages/teachermessages" element={<PrivateRoute><TeacherMessages /></PrivateRoute>} />
          <Route path="/pages/teachermeetings" element={<PrivateRoute><TeacherMeetings /></PrivateRoute>} />
          <Route path="/pages/teacheraccount" element={<PrivateRoute><TeacherAccount /></PrivateRoute>} />
          <Route path="/pages/studentmain" element={<PrivateRoute><StudentMain /></PrivateRoute>} />
          <Route path="/pages/studentclass" element={<PrivateRoute><StudentClass /></PrivateRoute>} />
          <Route path="/pages/studentlesson" element={<PrivateRoute><StudentLesson /></PrivateRoute>} />
          <Route path="/pages/studentcalendar" element={<PrivateRoute><StudentCalendar /></PrivateRoute>} />
          <Route path="/pages/studentgrades" element={<PrivateRoute><StudentGrades /></PrivateRoute>} />
          <Route path="/pages/studentmeetings" element={<PrivateRoute><StudentMeetings /></PrivateRoute>} />
          <Route path="/pages/studentmessages" element={<PrivateRoute><StudentMessages /></PrivateRoute>} />
          <Route path="/pages/studentaccount" element={<PrivateRoute><StudentAccount /></PrivateRoute>} />
          <Route path="/pages/principallogin" element={<PrincipalLogin />} />
          <Route path="/pages/studentlogin" element={<StudentLogin />} />
          <Route path="/pages/teacherlogin" element={<TeacherLogin />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
            </AuthProvider>

      </Router>
  );
}

export default App;
