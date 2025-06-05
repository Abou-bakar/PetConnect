import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Navbar = () => (
  <nav className="bg-[#65cadc] p-6 text-white text-center text-2xl font-bold">
    Pet-Connect Events
  </nav>
);

const Footer = () => (
  <footer className="bg-[#65cadc] text-white text-center p-4 mt-4">
    © 2025 PetConnect. All rights reserved.
  </footer>
);

export default function PetConnectEventUser() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter events based on search query
  const filteredEvents = events.filter((event) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      new Date(event.date).toLocaleDateString("en-US").includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65cadc]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        Error loading events: {error}
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F9]">
      <header className="text-center py-4 bg-[#65cadc] text-white">
        <h1 className="text-4xl font-bold">Pet-Connect Events</h1>
        <nav className="flex justify-center space-x-4">
          <a class="hover:text-[#45A1C1]" href="/Home">
            Home
          </a>
          <a href="/pethealth" className="hover:text-[#45A1C1]">
            Health Tracker
          </a>
          <a href="/Petsocial" className="hover:text-[#45A1C1]">
            Social Network
          </a>
          <a href="/UserPetEvents" className="hover:text-[#45A1C1]">
            Events
          </a>
          <a href="/login" className="hover:text-[#45A1C1]">
            Log out
          </a>
        </nav>
      </header>
      <div className="container mx-auto p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center text-[#65cadc]">
            Upcoming Events
          </h2>

          {/* Search Bar */}
          <div className="mb-6 px-8">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65cadc]"
            />
          </div>

          <div className="mb-2 space-y-2 p-8 rounded-lg">
            {filteredEvents.length === 0 ? (
              <div className="text-center text-gray-500 p-8">
                No events found matching your search
              </div>
            ) : (
              filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-6 border rounded-2xl shadow-lg bg-white"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {event.image_url && (
                      <img
                        src={`http://localhost:5000${event.image_url}`}
                        alt={event.title}
                        className="w-full md:w-48 h-48 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">{event.title}</h2>
                      <p className="text-gray-600">
                        📅{" "}
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="mt-2 text-sm">{event.description}</p>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-[#65cadc] text-white py-2 rounded hover:bg-[#45A1C1] ">
                    <a href="/ContactForm">Register</a>
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
