import React from 'react'
import Sidenav from './Sidenav'
import { useState,useEffect } from 'react';
import api from '../../api_r';
export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidenav />

      {/* Main Content */}
      <div className="flex-1 p-6 sm:ml-64">
        <div className="p-6 border rounded-lg shadow-md bg-white dark:bg-gray-900 dark:border-gray-700">
          <h1 className="text-2xl text-center font-bold mb-4 text-gray-800 dark:text-gray-200">
            Welcome 
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Welcome to your dashboard. Here you can manage your profile,
            view your activity, and access important resources.
          </p>
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
              <h2 className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
                No.of Courses Published
              </h2>
              <p className="text-xl text-center text-gray-500 dark:text-gray-400">
                {stats.courses_published}
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
              <h2 className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
               Active Courses
              </h2>
              <p className="text-xl text-center text-gray-500 dark:text-gray-400">
                {stats.active_courses}
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
              <h2 className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
                No.of Enrollments
              </h2>
              <p className="text-xl text-center text-gray-500 dark:text-gray-400">
                {stats.total_enrollments}
              </p>
            </div>

           
           
            
           
          </div>
 )}
          
        </div>
      </div>
    </div>
  )
}
