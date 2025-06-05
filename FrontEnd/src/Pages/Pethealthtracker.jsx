import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { formatDate } from "../utils/dateUtils";

// Axios token interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const PetHealth = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ petName: "", vaccine: "", date: "" });
  const [reminderForm, setReminderForm] = useState({ message: "", date: "" });
  const [editHealthId, setEditHealthId] = useState(null);
  const [editReminderId, setEditReminderId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Token validation
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

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recordsRes, remindersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/health/records"),
          axios.get("http://localhost:5000/api/health/reminders"),
        ]);
        setHealthRecords(recordsRes.data);
        setReminders(remindersRes.data);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("token")) {
      fetchData();
    }
  }, []);

  const handleApiError = (err) => {
    console.error("API Error:", err);
    if (err.response?.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  // Add or update health record
  const addHealthRecord = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const decoded = jwtDecode(token);
      const formData = { ...form, email: decoded.email };

      const url = editHealthId
        ? `http://localhost:5000/api/health/records/${editHealthId}`
        : "http://localhost:5000/api/health/records";

      const method = editHealthId ? "put" : "post";

      await axios[method](url, formData);

      const recordsRes = await axios.get(
        "http://localhost:5000/api/health/records"
      );
      setHealthRecords(recordsRes.data);
      setForm({ petName: "", vaccine: "", date: "" });
      setEditHealthId(null);
    } catch (err) {
      handleApiError(err);
    }
  };

  const deleteHealthRecord = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/health/records/${id}`);
      setHealthRecords((prev) => prev.filter((record) => record.id !== id));
    } catch (err) {
      handleApiError(err);
    }
  };

  // Add or update reminder
  const addReminder = async (e) => {
    e.preventDefault();
    try {
      const url = editReminderId
        ? `http://localhost:5000/api/health/reminders/${editReminderId}`
        : "http://localhost:5000/api/health/reminders";

      const method = editReminderId ? "put" : "post";
      await axios[method](url, reminderForm);

      const remindersRes = await axios.get(
        "http://localhost:5000/api/health/reminders"
      );
      setReminders(remindersRes.data);
      setReminderForm({ message: "", date: "" });
      setEditReminderId(null);
    } catch (err) {
      handleApiError(err);
    }
  };

  const deleteReminder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/health/reminders/${id}`);
      setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleEditHealth = (record) => {
    setEditHealthId(record.id);
    setForm({
      petName: record.petName,
      vaccine: record.vaccine,
      date: new Date(record.date).toISOString().split("T")[0],
    });
  };

  const handleEditReminder = (reminder) => {
    setEditReminderId(reminder.id);
    setReminderForm({
      message: reminder.message,
      date: new Date(reminder.date).toISOString().split("T")[0],
    });
  };

  return (
    <div>
      <header className="text-center py-4 bg-[#65cadc] text-white">
        <h1 className="text-4xl font-bold mb-4">Pet Health Tracker</h1>
        <nav className="flex justify-center space-x-4">
          <a class="hover:text-[#45A1C1]" href="/Home">
            Home
          </a>
          <a href="#health-records" className="text-white hover:underline">
            Health Records
          </a>
          <a href="#reminders" className="text-white hover:underline">
            Reminders
          </a>
          <a href="/login" className="hover:text-[#45A1C1]">
            Log out
          </a>
        </nav>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p>Loading health records...</p>
        </div>
      ) : (
        <div className="min-h-screen bg-[#F9F9F9] px-6 md:px-20 py-12">
          {/* Health Records Section */}
          <section id="health-records" className="mb-12">
            <h2 className="text-2xl font-bold text-[#65cadc] mb-4">
              Health Records Management
            </h2>
            <form onSubmit={addHealthRecord} className="mb-6">
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Pet Name"
                  value={form.petName}
                  onChange={(e) =>
                    setForm({ ...form, petName: e.target.value })
                  }
                  className="border px-4 py-2 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Vaccine"
                  value={form.vaccine}
                  onChange={(e) =>
                    setForm({ ...form, vaccine: e.target.value })
                  }
                  className="border px-4 py-2 rounded-lg"
                  required
                />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="border px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-[#65cadc] text-white py-2 px-4 rounded-lg hover:bg-[#45A1C1]"
              >
                {editHealthId ? "Update Record" : "Add Record"}
              </button>
            </form>
            <div className="grid gap-4">
              {healthRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>Pet:</strong> {record.petName}
                    </p>
                    <p>
                      <strong>Vaccine:</strong> {record.vaccine}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(record.date)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditHealth(record)}
                      className="bg-[#65cadc] text-white py-1 px-4 rounded-lg hover:bg-[#45A1C1]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHealthRecord(record.id)}
                      className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reminders Section */}
          <section id="reminders" className="mb-12">
            <h2 className="text-2xl font-bold text-[#65cadc] mb-4">
              Reminders
            </h2>
            <form onSubmit={addReminder} className="mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Reminder Message"
                  value={reminderForm.message}
                  onChange={(e) =>
                    setReminderForm({
                      ...reminderForm,
                      message: e.target.value,
                    })
                  }
                  className="border px-4 py-2 rounded-lg"
                  required
                />
                <input
                  type="date"
                  value={reminderForm.date}
                  onChange={(e) =>
                    setReminderForm({
                      ...reminderForm,
                      date: e.target.value,
                    })
                  }
                  className="border px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-[#65cadc] text-white py-2 px-4 rounded-lg hover:bg-[#45A1C1]"
              >
                {editReminderId ? "Update Reminder" : "Add Reminder"}
              </button>
            </form>
            <div className="grid gap-4">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>Reminder:</strong> {reminder.message}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(reminder.date)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditReminder(reminder)}
                      className="bg-[#65cadc] text-white py-1 px-4 rounded-lg hover:bg-[#45A1C1]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <footer className="bg-[#65cadc] text-white py-6 text-center">
        <p>© 2024 Pet Connect. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default PetHealth;
