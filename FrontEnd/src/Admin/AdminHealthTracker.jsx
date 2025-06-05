import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "../utils/dateUtils";

const AdminHealthTracker = () => {
  const [reminders, setReminders] = useState([]);
  const [filteredReminders, setFilteredReminders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Token validation check
  useEffect(() => {
    const validateToken = async () => {
      try {
        await axios.get("http://localhost:5000/api/auth/validate");
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      window.location.href = "/login";
    }
  }, []);

  // Fetch reminders
  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/health/admin/reminders",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReminders(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reminders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();

    const interval = setInterval(() => {
      fetchReminders();
    }, 30000); // Auto refresh every 30 seconds

    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  // Filter + Search Logic
  useEffect(() => {
    let updated = reminders;

    if (searchQuery.trim() !== "") {
      updated = updated.filter(
        (reminder) =>
          reminder.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (reminder.email &&
            reminder.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterStatus !== "all") {
      updated = updated.filter(
        (reminder) =>
          (reminder.status === "sent" && filterStatus === "sent") ||
          (reminder.status === "pending" && filterStatus === "pending")
      );
    }

    setFilteredReminders(updated);
  }, [searchQuery, filterStatus, reminders]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col">
      <header className="text-center py-6 bg-[#65cadc] text-white">
        <h1 className="text-4xl font-bold mb-2">Admin - Health Reminders</h1>
        <a href="/adminhome" className="hover:text-[#45A1C1] pr-4">
          Home
        </a>
        <a href="/adoption" className="hover:text-[#45A1C1] pr-4">
          Adoption
        </a>
        <a href="/admin/health-tracker" className="hover:text-[#45A1C1] pr-4">
          Admin Health Tracker
        </a>
        <a href="/petsocial" className="hover:text-[#45A1C1] pr-4">
          Social Network
        </a>
        <a href="/login" className="hover:text-[#45A1C1] pr-4">
          Log out
        </a>
        <p className="text-sm">
          Last updated:{" "}
          {lastUpdated ? lastUpdated.toLocaleTimeString() : "Loading..."}
        </p>
      </header>

      <main className="flex-1 px-6 md:px-20 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by message or email..."
            className="px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full md:w-1/3"
          />

          <select
            value={filterStatus}
            onChange={handleStatusFilterChange}
            className="px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full md:w-1/4"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-600">
            <p>Loading reminders...</p>
          </div>
        ) : (
          <section>
            <h2 className="text-2xl font-bold text-[#65cadc] mb-6">
              All Reminders
            </h2>
            {filteredReminders.length === 0 ? (
              <p className="text-gray-600">No reminders available.</p>
            ) : (
              <div className="grid gap-6">
                {filteredReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
                  >
                    <div>
                      <p className="text-lg">
                        <strong>Message:</strong> {reminder.message}
                      </p>
                      <p>
                        <strong>Date:</strong> {formatDate(reminder.date)}
                      </p>
                      <p>
                        <strong>Email:</strong> {reminder.email}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          reminder.status === "sent"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {reminder.status === "sent" ? "Sent" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="bg-[#65cadc] text-white py-6 text-center">
        <p>© 2024 Pet Connect. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AdminHealthTracker;
