import { useState, useEffect } from "react";
import { Trash, Edit } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-[#65cadc] p-6 text-white text-center text-lg font-bold">
      PetConnect Admin Panel
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-[#65cadc] text-white text-center p-4 mt-4">
      © 2025 PetConnect. All Rights Reserved.
    </footer>
  );
}

export default function PetConnectEventAdmin() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    description: "",
    image: null, // Changed from empty string to null for File object
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        const data = await response.json();
        if (response.ok) {
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEvent({ ...newEvent, image: file });
    }
  };

  const addEvent = async () => {
    // Basic validation
    if (!newEvent.title || !newEvent.date || !newEvent.description) {
      alert("Title, Date, and Description are required!");
      return;
    }

    // Create FormData for file upload
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("date", newEvent.date);
    formData.append("description", newEvent.description);

    if (newEvent.image) {
      formData.append("image", newEvent.image);
    }

    try {
      const url = editingEvent
        ? `http://localhost:5000/api/events/${editingEvent.id}`
        : "http://localhost:5000/api/events";

      const response = await fetch(url, {
        method: editingEvent ? "PUT" : "POST",
        body: formData, // FormData doesn't need Content-Type header
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh event list
        const updatedResponse = await fetch("http://localhost:5000/api/events");
        const updatedData = await updatedResponse.json();
        setEvents(updatedData);

        // Reset form
        setNewEvent({ title: "", date: "", description: "", image: null });
        setEditingEvent(null);
        alert(`Event ${editingEvent ? "updated" : "added"} successfully!`);
      } else {
        alert("Error: " + (data.error || "Something went wrong"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process event.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== id));
        alert("Event deleted successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete event.");
    }
  };

  const editEvent = (event) => {
    setNewEvent({
      title: event.title,
      date: event.date.split("T")[0], // Format date for input
      description: event.description,
      image: null, // Reset image input when editing
    });
    setEditingEvent(event);
  };

  return (
    <div className="bg-[#F9F9F9]">
      <Navbar />
      <div className="p-24 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#65cadc]">
          Manage PetConnect Events
        </h2>

        {/* Event Form */}
        <div className="mb-4 space-y-2 bg-gray-100 p-4 rounded-lg">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="date"
            value={newEvent.date}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Event Description"
            value={newEvent.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />

          {/* Image Preview */}
          {(newEvent.image || editingEvent?.image_url) && (
            <img
              src={
                newEvent.image
                  ? URL.createObjectURL(newEvent.image) // Preview new upload
                  : `http://localhost:5000${editingEvent.image_url}` // Show existing image
              }
              alt="Event Preview"
              className="w-full h-40 object-cover mt-2 rounded"
            />
          )}
          <button
            onClick={addEvent}
            disabled={isLoading}
            className={`w-full text-white py-2 rounded flex items-center justify-center ${
              isLoading ? "bg-gray-400" : "bg-[#65cadc] hover:bg-[#45A1C1]"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {editingEvent ? "Updating..." : "Adding..."}
              </>
            ) : editingEvent ? (
              "Update Event"
            ) : (
              "Add Event"
            )}
          </button>
        </div>

        {/* Event List */}
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 border rounded bg-white shadow-md flex justify-between items-center"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={`http://localhost:5000${event.image_url}`}
                  alt="Event"
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString("en-CA")}
                  </p>
                  <p className="text-sm">{event.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editEvent(event)}
                  className="text-blue-500"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="text-red-500 bg-gray-200 px-2 py-1 rounded"
                >
                  <Trash className="w-5 h-5 inline-block mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
