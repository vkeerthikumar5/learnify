import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api_r";
import Sidenav from "./Sidenav";

export default function CourseContents() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch course + modules
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/user/courses/${id}`);
        setCourse(res.data.course);
        setModules(res.data.modules);
      } catch (err) {
        console.error(err);
        alert("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const nextModule = () => setCurrentModuleIndex(i => Math.min(i + 1, modules.length - 1));
  const prevModule = () => setCurrentModuleIndex(i => Math.max(i - 1, 0));

  // Convert YouTube URL to embed format
  const getYouTubeEmbedURL = (url) => {
    try {
      let videoId = "";
      if (url.includes("watch?v=")) videoId = url.split("watch?v=")[1].split("&")[0];
      else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
      else return null;
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!course) return null;

  const currentModule = modules[currentModuleIndex];
  const isVideoModule = currentModule?.type === "youtube";
  const videoURL = isVideoModule ? getYouTubeEmbedURL(currentModule.content) : null;

  return (
    <div className="flex">
      <Sidenav />
      <div className="flex-1 p-6 sm:ml-64">
        <h1 className="text-3xl font-bold mb-2 text-green-800">{course.title}</h1>
        <p className="mb-2 text-gray-700">{course.description}</p>
        <p className="mb-6 text-gray-500 italic">
          Published by: <span className="font-semibold">{course.user_name || "Admin"}</span>
        </p>

        {modules.length > 0 ? (
          <div className="border rounded-lg p-4 bg-green-50 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{currentModule.title}</h2>

            {isVideoModule && videoURL ? (
              <iframe
                className="w-full h-64 mt-2 rounded-lg shadow"
                src={videoURL}
                title={currentModule.title}
                allowFullScreen
              ></iframe>
            ) : (
              <p className="mb-4">{currentModule.content || "No content available"}</p>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={prevModule}
                disabled={currentModuleIndex === 0}
                className="px-4 py-2 bg-green-200 rounded hover:bg-green-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-green-700 font-semibold">
                Module {currentModuleIndex + 1} / {modules.length}
              </span>
              <button
                onClick={nextModule}
                disabled={currentModuleIndex === modules.length - 1}
                className="px-4 py-2 bg-green-200 rounded hover:bg-green-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No modules added yet.</p>
        )}

        <button
          onClick={() => navigate("/user/enrolled-courses")}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Back to Courses
        </button>
      </div>
    </div>
  );
}
