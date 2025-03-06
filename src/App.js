// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import ApproveUsers from './pages/ApproveUsers';
import ViewTodayFees from './pages/ViewTodayFees';
import ViewStudentQueries from './pages/ViewStudentQueries';
import CounsellorDashboard from "./pages/CounsellorDashboard";
import ApproveStudents from './pages/ApproveStudents';
import TrainerDashboard from './pages/TrainerDashboard';
import AddBatch from './pages/AddBatch';
import AddCourse from './pages/AddCourse';
import ManageAttendance from "./pages/ManageAttendance";
import StudentDashboard from './pages/StudentDashboard';
// Import the Fee Portal and its pages
import FeePortal from './pages/FeePortal';
import SubmitStudentFees from './pages/SubmitStudentFees';
import ViewStudentList from './pages/ViewStudentList';
import SetFeesForNewStudent from './pages/SetFeesForNewStudent';
import EditProfile from './pages/EditProfile';
import AssignmentUploadTrainer from "./pages/AssignmentUploadByTrainer"
import AssignmentViewTrainer from "./pages/ViewAssignmentStudentsBytrainer"
import AttendanceViewTrainer from "./pages/AttendanceViewTrainer"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/approve-users" element={<ApproveUsers />} />
        <Route path="/fee-portal" element={<FeePortal />} />
        <Route path="/fee-portal/submit-student-fees" element={<SubmitStudentFees />} />
        <Route path="/fee-portal/view-today-fees" element={<ViewTodayFees />} />
        <Route path="/fee-portal/view-student-list" element={<ViewStudentList />} />
        <Route path="/fee-portal/set-fees-for-new-student" element={<SetFeesForNewStudent />} />
        <Route path="/admin/view-queries" element={<ViewStudentQueries />} />
        <Route path="/counsellor-dashboard" element={<CounsellorDashboard />} />
        <Route path="/approve-students" element={<ApproveStudents />} />
        <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/add-course" element={<AddCourse />} />
        <Route path="/trainer/add-batch" element={<AddBatch />} />
        <Route path="/trainer/manage-attendance" element={<ManageAttendance />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/trainer/upload-assignment" element={<AssignmentUploadTrainer />} />
        <Route path="/trainer/view-assignments" element={<AssignmentViewTrainer />} />
        <Route path="/trainer/student-summary" element={<AttendanceViewTrainer />} />
      </Routes>
    </Router>
  );
}

export default App;
