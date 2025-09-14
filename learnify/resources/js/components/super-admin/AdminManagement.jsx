import React, { useState, useEffect } from 'react';
import Sidenav from './Sidenav';
import api from '../../api_r';

export default function AdminManagement() {
    const [admins, setAdmins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [buttonLoadingId, setButtonLoadingId] = useState(null);

    // Fetch admins
    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admins");
            setAdmins(res.data);
        } catch (err) {
            console.error("Error fetching admins:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const filteredAdmins = admins.filter(admin =>
        Object.values(admin).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const toggleActivation = async (id) => {
        try {
            setButtonLoadingId(id);
            const admin = admins.find(a => a.id === id);
            const updatedStatus = !admin.is_active;

            await api.patch(`/admins/${id}/toggle-activation`, {
                is_active: updatedStatus
            });

            setAdmins(prev =>
                prev.map(a =>
                    a.id === id ? { ...a, is_active: updatedStatus } : a
                )
            );
        } catch (err) {
            console.error("Error toggling admin status:", err);
        } finally {
            setButtonLoadingId(null);
        }
    };

    return (
        <section className="flex">
            <Sidenav />
            <div className="flex-1 p-6 sm:ml-64">
                <div className="p-6 border rounded-lg shadow-md bg-white dark:bg-gray-900 dark:border-gray-700">
                    <h1 className="text-2xl text-center font-bold mb-6 text-gray-800 dark:text-gray-200">
                        Admin Management
                    </h1>

                    {/* Search */}
                    <div className="flex justify-center mb-6">
                        <input
                            type="text"
                            placeholder="Search admins..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">S.No</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Admin Name</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Email</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Courses Published</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-gray-500">
                                            Loading admins...
                                        </td>
                                    </tr>
                                ) : filteredAdmins.length > 0 ? (
                                    filteredAdmins.map((admin, index) => (
                                        <tr key={admin.id} className="hover:bg-gray-100">
                                            <td className="px-4 py-2 text-center">{index + 1}</td>
                                            <td className="px-4 py-2 text-center truncate">{admin.name}</td>
                                            <td className="px-4 py-2 text-center truncate">{admin.email}</td>
                                            <td className="px-4 py-2 text-center">{admin.courses_count || 0}</td>
                                            <td className="px-4 py-2 flex gap-2 justify-center">
                                                <button
                                                    onClick={() => toggleActivation(admin.id)}
                                                    disabled={buttonLoadingId === admin.id}
                                                    className={`px-3 py-1 rounded text-white flex items-center justify-center gap-2 ${
                                                        admin.is_active
                                                            ? 'bg-red-600 hover:bg-red-700'
                                                            : 'bg-green-600 hover:bg-green-700'
                                                    } ${buttonLoadingId === admin.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    {buttonLoadingId === admin.id ? (
                                                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                                    ) : (
                                                        admin.is_active ? 'Revoke Access' : 'Activate'
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-gray-500">
                                            No admins found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
