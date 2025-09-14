import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidenav from "./Sidenav";
import api from "../../api_r";
import { FaBook, FaEllipsisV, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function CourseModules() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [moduleForm, setModuleForm] = useState({ title: "", type: "theory", content: "" });
    const [activeMenu, setActiveMenu] = useState(null); // For three-dot menu

    const fetchCourseAndModules = async () => {
        try {
            setLoading(true);
            const courseRes = await api.get(`/courses/${courseId}`);
            const modulesRes = await api.get(`/courses/${courseId}/modules`);
            setCourse(courseRes.data);
            setModules(modulesRes.data);
        } catch (err) {
            console.error("Failed to fetch course/modules", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseAndModules();
    }, [courseId]);

    const handleModuleChange = (e) => {
        setModuleForm({ ...moduleForm, [e.target.name]: e.target.value });
    };

    function getYouTubeEmbedURL(url) {
        try {
            let videoId = "";
            if (url.includes("watch?v=")) {
                videoId = url.split("watch?v=")[1].split("&")[0];
            } else if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1].split("?")[0];
            } else {
                return null;
            }
            return `https://www.youtube.com/embed/${videoId}`;
        } catch {
            return null;
        }
    }



    const handleModuleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingModule) {
                await api.put(`/modules/${editingModule.id}`, moduleForm);
            } else {
                await api.post(`/courses/${courseId}/modules`, moduleForm);
            }
            setShowModuleModal(false);
            setEditingModule(null);
            setModuleForm({ title: "", type: "theory", content: "" });
            fetchCourseAndModules();
        } catch (err) {
            console.error("Failed to save module", err);
            alert("Error saving module");
        }
    };

    const handleDeleteModule = async (id) => {
        if (!window.confirm("Are you sure you want to delete this module?")) return;
        try {
            await api.delete(`/modules/${id}`);
            fetchCourseAndModules();
        } catch (err) {
            console.error("Failed to delete module", err);
        }
    };

    return (
        <div className="flex">
            <Sidenav />



            <div className="flex-1 p-6 sm:ml-64">
                {loading ? (
                    <div className="flex justify-center items-center mt-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                    </div>
                ) : (
                    <>

                        {/* Course Title & Description */}
                        {course && (
                            <div className="bg-white p-6 rounded-lg shadow mb-6">
                                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                                <p className="text-gray-700">{course.description || "No description provided."}</p>
                                {course && course.status === 'inactive' && (
                                    <div className="flex justify-end mb-4">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const res = await api.post(`/courses/${course.id}/publish`);
                                                    setCourse(res.data.course); // update local state
                                                    alert("Course published successfully!");
                                                } catch (err) {
                                                    console.error(err);
                                                    alert("Failed to publish course");
                                                }
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Publish Course
                                        </button>

                                    </div>
                                )}
                            </div>
                        )}

                        {/* Add Module Button */}
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => {
                                    setEditingModule(null);
                                    setModuleForm({ title: "", type: "theory", content: "" });
                                    setShowModuleModal(true);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                            >
                                <FaPlus /> Add Module
                            </button>
                        </div>

                        {/* Modules List */}
                        {modules.length > 0 ? (
                            <div className="space-y-4">
                                {modules.map((module) => (
                                    <div key={module.id} className="border p-4 rounded shadow flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                <FaBook className="text-green-600" /> {module.title} ({module.type})
                                            </h3>


                                            {module.type === "youtube" && module.content ? (
                                                getYouTubeEmbedURL(module.content) ? (
                                                    <iframe
                                                        className="w-full h-64 mt-2 rounded-lg shadow"
                                                        src={getYouTubeEmbedURL(module.content)}
                                                        title={module.title}
                                                        allowFullScreen
                                                    ></iframe>
                                                ) : (
                                                    <p className="text-blue-600 mt-1 underline">
                                                        <a href={module.content} target="_blank" rel="noreferrer">{module.content}</a>
                                                    </p>
                                                )
                                            ) : (
                                                <p className="text-gray-700 mt-1">{module.content || "No content yet"}</p>
                                            )}
                                        </div>

                                        {/* Three-dot menu */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setActiveMenu(activeMenu === module.id ? null : module.id)}
                                                className="p-2 hover:bg-gray-100 rounded"
                                            >
                                                <FaEllipsisV />
                                            </button>
                                            {activeMenu === module.id && (
                                                <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                                                    <button
                                                        onClick={() => {
                                                            setEditingModule(module);
                                                            setModuleForm({
                                                                title: module.title,
                                                                type: module.type,
                                                                content: module.content,
                                                            });
                                                            setShowModuleModal(true);
                                                            setActiveMenu(null);
                                                        }}
                                                        className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                                                    >
                                                        <FaEdit /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDeleteModule(module.id);
                                                            setActiveMenu(null);
                                                        }}
                                                        className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                                                    >
                                                        <FaTrash /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No modules added yet.</p>
                        )}
                    </>
                )}

                {/* Module Modal */}
                {showModuleModal && (
                    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">{editingModule ? "Edit Module" : "Add Module"}</h3>
                                <button
                                    onClick={() => setShowModuleModal(false)}
                                    className="text-gray-400 hover:text-gray-900 font-bold text-xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleModuleSubmit} className="space-y-4">
                                <div>
                                    <label className="block mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={moduleForm.title}
                                        onChange={handleModuleChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1">Type</label>
                                    <select
                                        name="type"
                                        value={moduleForm.type}
                                        onChange={handleModuleChange}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="theory">Theory</option>
                                        <option value="youtube">Video (YouTube)</option>
                                       
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-1">Content</label>
                                    <textarea
                                        name="content"
                                        value={moduleForm.content}
                                        onChange={handleModuleChange}
                                        rows={4}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Text, YouTube URL, or Quiz JSON"
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModuleModal(false)}
                                        className="px-4 py-2 border rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
