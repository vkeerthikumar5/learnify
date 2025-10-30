import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Sidenav from "./Sidenav";
import api from "../../api_r";

export default function Enrollments() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // ✅ Fetch all enrollments grouped by user
        const res = await api.get("/enrollments");
        setCandidates(res.data || []);
      } catch (err) {
        console.error("Failed to fetch enrollments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // Filter candidates based on search input
  const filteredCandidates = candidates.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.courses?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 sm:ml-64 flex justify-center items-center mt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:ml-64">
      <Sidenav />

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold mb-4">Enrolled Candidates</h1>

        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-2">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Candidates Table */}
        {filteredCandidates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Enrolled For</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{c.name || "N/A"}</td>
                    <td className="px-4 py-2 border">{c.email || "N/A"}</td>
                    <td className="px-4 py-2 border">{c.courses || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No enrolled candidates found</p>
        )}
      </div>
    </div>
  );
}
