import React, { useState, useEffect, useRef } from "react";
import Sidenav from "./Sidenav";
import api from "../../api_r";
import { useNavigate } from "react-router-dom";

import {
    FaBook,
    FaChalkboardTeacher,
    FaCalendarAlt,
    FaTrash,
    FaEdit,
    FaEllipsisV,
} from "react-icons/fa";

export default function Courses() {
    const [showModal, setShowModal] = useState(false);
    const [courses, setCourses] = useState([]);
    const [loadingCourseId, setLoadingCourseId] = useState(null);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const menuRef = useRef(null);
    const [editingCourse, setEditingCourse] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    // Fetch courses
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await api.get("/courses");
            setCourses(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch courses", err);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                !e.target.closest(".course-menu-button") &&
                !e.target.closest(".course-menu-dropdown")
            ) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                await api.put(`/courses/${editingCourse.id}`, formData);
            } else {
                await api.post("/courses", formData);
            }

            setShowModal(false);
            setEditingCourse(null);
            setFormData({
                title: "",
                description: "",
            });
            fetchCourses();
        } catch (err) {
            console.error(err);
            alert("Error saving course");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            setLoadingCourseId(id);
            await api.delete(`/courses/${id}`);
            fetchCourses();
        } catch (err) {
            console.error("Failed to delete course", err);
        } finally {
            setLoadingCourseId(null);
        }
    };

    return (
        <div className="flex">
            <Sidenav />

            <div className="flex-1 p-6 sm:ml-64">
                <div className="p-6 border rounded-lg shadow-md bg-white">
                    <h1 className="text-2xl text-center font-bold mb-4 text-gray-800">
                        Courses
                    </h1>
                    <p className="text-center text-gray-600 mb-6">
                        Manage your Courses here
                    </p>

                    {/* Trigger Button */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => {
                                setEditingCourse(null);
                                setFormData({ title: "", description: "" });
                                setShowModal(true);
                            }}
                            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 
    focus:outline-none focus:ring-green-300 font-medium rounded-lg 
    text-sm px-5 py-2.5 text-center inline-flex items-center"
                        >
                            Add Course
                        </button>
                    </div>

                    {/* Course Cards */}
                    {/* Course Cards */}
                    {loading ? (
                        <div className="flex justify-center items-center mt-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                        </div>
                    ) : courses.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="border rounded-xl shadow-lg p-6 bg-gradient-to-br from-violet-50 to-white hover:shadow-xl transition duration-300 flex flex-col justify-between"
                                >
                                    {/* Title + Menu */}
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                            <FaBook className="text-green-600" /> {course.title}
                                        </h2>

                                        {/* 3 Dots Dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setMenuOpenId(menuOpenId === course.id ? null : course.id)
                                                }
                                                className="p-2 rounded-full hover:bg-gray-200 course-menu-button"
                                            >
                                                <FaEllipsisV />
                                            </button>

                                            {menuOpenId === course.id && (
                                                <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-10 course-menu-dropdown">
                                                    <button
                                                        onClick={() => {
                                                            setEditingCourse(course);
                                                            setFormData({
                                                                title: course.title,
                                                                description: course.description,
                                                            });
                                                            setShowModal(true);
                                                            setMenuOpenId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(course.id)}
                                                        disabled={loadingCourseId === course.id}
                                                        className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded ${loadingCourseId === course.id
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                            }`}
                                                    >
                                                        {loadingCourseId === course.id ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="flex-1">
                                        <p className="text-gray-700 mb-3 flex items-center gap-2">
                                            <FaChalkboardTeacher className="text-blue-500" />{" "}
                                            {course.description}
                                        </p>
                                        <p className="text-gray-500 text-sm flex items-center gap-2">
                                            <FaCalendarAlt className="text-gray-400" /> Added on{" "}
                                            {new Date(course.created_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Add/View Contents Button */}
                                    <div className="mt-4 flex justify-center">
                                        <button
                                            onClick={() => navigate(`/admin/courses/${course.id}/modules`)}
                                            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm"
                                        >
                                            Add / View Contents
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-10">
                            No courses added yet. Add one above.
                        </p>
                    )}

                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative bg-white rounded-lg shadow w-full max-w-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {editingCourse ? "Edit Course" : "Add Course"}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Course Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Course Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Save Course
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
