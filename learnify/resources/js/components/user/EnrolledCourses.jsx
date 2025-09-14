import React, { useEffect, useState } from "react";
import Sidenav from "./Sidenav";
import api from "../../api_r";
import { FaBook, FaCalendarAlt, FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function EnrolledCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/enrolled-courses");
      setCourses(res.data.data || res.data); // handle both paginated or non-paginated response
    } catch (err) {
      console.error("Failed to fetch enrolled courses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="flex">
      <Sidenav />

      <div className="flex-1 p-6 sm:ml-64">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-800">
          My Enrolled Courses
        </h1>

        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border rounded-lg shadow p-4 bg-green-50 hover:shadow-xl transition duration-300"
              >
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-green-700">
                  <FaBook /> {course.title}
                </h2>
                <p className="text-gray-700 mb-2">{course.description}</p>
                <p className="text-gray-500 text-sm flex items-center gap-1 mb-1">
                  <FaUserAlt className="text-gray-400" />
                  Published by: {course.user_name || "Admin"}
                </p>
                <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                  <FaCalendarAlt className="text-gray-400" />
                  {new Date(course.created_at).toLocaleDateString()}
                </p>
                <button
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
                >
                  View Course
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No courses enrolled yet.</p>
        )}
      </div>
    </div>
  );
}
