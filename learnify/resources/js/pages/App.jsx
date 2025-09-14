import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../components/Login';

import ProtectedRoute from '../ProtectedRoute';
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
import Profile from '../components/admin/Profile';
import CourseDetails from '../components/admin/CourseDetails';
import ViewCourses from '../components/user/ViewCourses';
import EnrolledCourses from '../components/user/EnrolledCourses';
import CourseContents from '../components/user/CourseContents';



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Main />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
         

        </Route>
        
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/courses"
          element={
            <ProtectedRoute role="user">
              <ViewCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/enrolled-courses"
          element={
            <ProtectedRoute role="user">
              <EnrolledCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute role="user">
              <CourseContents />
            </ProtectedRoute>
          }
        />
     
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute role="admin">
            <Courses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/enrollments"
        element={
          <ProtectedRoute role="admin">
            <Enrollments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute role="admin">
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses/:courseId/modules"
        element={
          <ProtectedRoute role="admin">
            <CourseDetails />
          </ProtectedRoute>
        }
      />


      <Route
        path="/super-admin/dashboard"
        element={
          <ProtectedRoute role="super-admin">
            <SA_Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/super-admin/user-management"
        element={
          <ProtectedRoute role="super-admin">
            <UserManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/super-admin/admin-management"
        element={
          <ProtectedRoute role="super-admin">

            <AdminManagement />
          </ProtectedRoute>
        }
      />


    </Routes>
    </BrowserRouter >
  );
}
