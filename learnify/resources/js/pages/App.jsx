import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import UserDashboard from '../components/user/User_Dashboard';
import AdminDashboard from '../components/admin/AdminDashboard';
import SA_Dashboard from '../components/super-admin/SA_Dashboard';
import Main from './Main';
import Landing from './Landing';
import UserManagement from '../components/super-admin/UserManagement';
import AdminManagement from '../components/super-admin/AdminManagement';
import Courses from '../components/admin/Courses';
import Enrollments from '../components/admin/Enrollments';
import CourseDetails from '../components/admin/CourseDetails';
import ViewCourses from '../components/user/ViewCourses';
import EnrolledCourses from '../components/user/EnrolledCourses';
import CourseContents from '../components/user/CourseContents';
import ProtectedRoute from '../ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<Landing />} />

        {/* Routes with Main layout */}
        <Route element={<Main />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* User routes */}
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/courses" element={<ViewCourses />} />
          <Route path="/user/enrolled-courses" element={<EnrolledCourses />} />
          <Route path="/courses/:id" element={<CourseContents />} />
          <Route path="/user/jobs" element={<UserDashboard />} /> {/* Example extra user route */}
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<Courses />} />
          <Route path="/admin/enrollments" element={<Enrollments />} />
          <Route path="/admin/courses/:courseId/modules" element={<CourseDetails />} />
        </Route>

        {/* Super Admin routes */}
        <Route element={<ProtectedRoute role="super-admin" />}>
          <Route path="/super-admin/dashboard" element={<SA_Dashboard />} />
          <Route path="/super-admin/user-management" element={<UserManagement />} />
          <Route path="/super-admin/admin-management" element={<AdminManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
