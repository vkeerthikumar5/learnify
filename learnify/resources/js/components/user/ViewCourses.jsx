import React, { useState, useEffect } from "react";
import api from "../../api_r";
import Sidenav from "./Sidenav";
import { FaBook, FaUserAlt, FaCalendarAlt } from "react-icons/fa";

export default function ViewCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseModules, setCourseModules] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false); // ✅ spinner for modal

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/user/courses");
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const openCourseModal = async (courseId) => {
    try {
      setModalLoading(true); // ✅ show spinner
      setModalOpen(true);
      const res = await api.get(`/user/courses/${courseId}`);
      setSelectedCourse(res.data.course);
      setCourseModules(res.data.modules);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch course details");
      setModalOpen(false);
    } finally {
      setModalLoading(false); // ✅ hide spinner
    }
  };

  const handleEnroll = async () => {
    try {
      await api.post(`/user/courses/${selectedCourse.id}/enroll`);
      alert("Enrolled successfully!");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to enroll");
    }
  };

  return (
    <div className="flex">
      <Sidenav />

      <div className="flex-1 p-6 sm:ml-64">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Available Courses
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
                className="border rounded-lg shadow p-4 bg-white hover:shadow-xl transition duration-300"
              >
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <FaBook className="text-green-600" />
                  {course.title}
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
                  onClick={() => openCourseModal(course.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No courses available.</p>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              {modalLoading ? ( // ✅ spinner while fetching modal data
                <div className="flex justify-center items-center mt-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                </div>
              ) : selectedCourse ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">{selectedCourse.title}</h3>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="text-gray-400 hover:text-gray-900 font-bold text-xl"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-700 mb-2">{selectedCourse.description}</p>
                  <p className="text-gray-500 text-sm mb-2">
                    Published by: {selectedCourse.user_name || "Admin"}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    Published on: {new Date(selectedCourse.created_at).toLocaleDateString()}
                  </p>

                  <h4 className="font-semibold mb-2">Modules:</h4>
                  <ul className="mb-4">
                    {courseModules.map((m) => (
                      <li key={m.id} className="text-gray-700 mb-1">
                        • {m.title} ({m.type})
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleEnroll}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
                  >
                    Enroll Now
                  </button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
