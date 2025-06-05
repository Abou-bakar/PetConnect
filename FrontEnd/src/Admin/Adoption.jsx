import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Importing Link for navigation
import axios from "axios";
import { ClipLoader, GridLoader, HashLoader } from "react-spinners";

const Adoption = () => {
  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    breed: "",
    age: "",
    location: "",
    description: "",
    image: null, // Store the uploaded image
    imagePreview: "", // Preview of the uploaded image
  });

  const [editing, setEditing] = useState(false);
  const formRef = useRef(null);
  const [loadingStates, setLoadingStates] = useState({}); // Track loading states for each request ID
  const [message, setMessage] = useState(""); // General success/error message

  // Fetch pets and adoption requests from the backend when the component loads
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pets");
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/pets/adoption-requests"
        );
        const data = await response.json();
        setRequests(data); // Populate requests from backend
      } catch (error) {
        console.error("Error fetching adoption requests:", error);
      }
    };

    fetchPets();
    fetchRequests();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevData) => ({
          ...prevData,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add or update pet
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name || ""); // Ensure non-empty fields
    data.append("breed", formData.breed || "");
    data.append("age", formData.age || "");
    data.append("location", formData.location || "");
    data.append("description", formData.description || "");

    // Append image if a new one is uploaded
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      let response;
      if (editing) {
        // PUT request to update the pet
        response = await fetch(
          `http://localhost:5000/api/pets/${formData.id}`,
          {
            method: "PUT",
            body: data,
          }
        );
      } else {
        // POST request to add a new pet
        response = await fetch("http://localhost:5000/api/pets/add-pet", {
          method: "POST",
          body: data,
        });
      }

      if (!response.ok) {
        throw new Error(
          editing ? "Failed to update pet." : "Failed to add pet."
        );
      }

      const result = await response.json();
      alert(result.message);

      if (editing) {
        // Update the pet list with the edited pet
        setPets((prevPets) =>
          prevPets.map((pet) =>
            pet.id === formData.id
              ? {
                  ...pet,
                  name: formData.name,
                  breed: formData.breed,
                  age: formData.age,
                  location: formData.location,
                  description: formData.description,
                  image: formData.imagePreview || pet.image, // Retain previous image if no new one
                }
              : pet
          )
        );
      } else {
        // Add the new pet to the list
        setPets([
          ...pets,
          {
            ...formData,
            id: result.id,
            image: result.image, // Use the full image URL from the server
          },
        ]);
      }

      // Reset form
      setFormData({
        id: "",
        name: "",
        breed: "",
        age: "",
        location: "",
        description: "",
        image: null,
        imagePreview: "",
      });
      setEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error adding/updating pet:", error);
      alert(error.message); // Display error message
    }
  };

  // Delete pet
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting pet");
      }

      // Remove the deleted pet from the list
      setPets(pets.filter((pet) => pet.id !== id));
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  // Edit pet
  const handleEdit = (pet) => {
    setFormData({
      id: pet.id,
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      location: pet.location,
      description: pet.description,
      image: null, // Reset image input for new uploads
      imagePreview: pet.image, // Preview existing image
    });
    setEditing(true);

    // Scroll to the form
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  //Handle request accept or reject action
  const handleRequestAction = async (id, action) => {
    setLoadingStates((prevState) => ({ ...prevState, [id]: action }));
    setMessage(""); // Clear previous messages

    try {
      const response = await fetch(
        `http://localhost:5000/api/pets/adoption-requests/${id}/${action}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to ${action} the adoption request.`
        );
      }

      const result = await response.json();
      alert(result.message);

      // Optionally update requests list
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: action } : request
        )
      );
    } catch (error) {
      console.error(`Error ${action}ing adoption request:`, error);
      alert(error.message);
    } finally {
      setLoadingStates((prevState) => ({ ...prevState, [id]: null }));
    }
  };

  // Delete adoption request
  const handleRequestDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/pets/adoption-requests/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the adoption request.");
      }

      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== id)
      );
      alert("Adoption request has been deleted.");
    } catch (error) {
      console.error("Error deleting adoption request:", error);
      alert("Failed to delete the request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <header className="text-center py-4 bg-[#65cadc] text-white">
        <h1 className="text-4xl font-bold pb-3">Admin Panel</h1>
        {/* <p className="mt-4 text-lg">Manage Pet Adoption Listings</p> */}
        <Link to="/adminhome" className="hover:text-[#45A1C1] pr-4">
          Home
        </Link>
        <a href="#add-edit" className="hover:text-[#45A1C1] pr-4">
          Add Pet
        </a>
        <a href="#pet-list" className="hover:text-[#45A1C1] pr-4">
          Pet Listings
        </a>
        <a href="#adoption-requests" className="hover:text-[#45A1C1] pr-4">
          Adoption Requests
        </a>
        <Link to="/login" className="hover:text-[#45A1C1]">
          Log out
        </Link>
      </header>

      {/* Form Section */}
      <div className="px-6 md:px-20 py-10">
        <form
          id="add-edit"
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-[#65cadc] mb-6">
            {editing ? "Edit Pet" : "Add New Pet"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Pet Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65cadc]"
            />
            <input
              type="text"
              name="breed"
              placeholder="Breed"
              value={formData.breed}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65cadc]"
            />
            <input
              type="text"
              name="age"
              placeholder="Age & Gender"
              value={formData.age}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65cadc]"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65cadc]"
            />
          </div>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full mt-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65cadc]"
          ></textarea>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full mt-4 p-3 border rounded-lg"
          />
          {formData.imagePreview && (
            <img
              src={formData.imagePreview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg mt-4"
            />
          )}
          <button
            type="submit"
            className="bg-[#65cadc] text-white py-2 px-6 rounded-lg mt-4 hover:bg-[#45A1C1]"
          >
            {editing ? "Update Pet" : "Add Pet"}
          </button>
        </form>
      </div>

      {/* Pet List */}
      <div className="px-6 md:px-20 pb-20" id="pet-list">
        <h2 className="text-2xl font-bold text-[#65cadc] mb-6 text-center">
          Pet Listings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-lg shadow-md p-4 hover:scale-105 transition-transform"
            >
              {pet.image && (
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="h-64 w-full object-cover rounded-lg"
                />
              )}
              <h3 className="text-xl font-bold text-[#65cadc]">{pet.name}</h3>
              <p className="text-gray-700">{pet.breed}</p>
              <p className="text-gray-500">{pet.age}</p>
              <p className="text-gray-500">{pet.location}</p>
              <p className="text-gray-600 mt-2">{pet.description}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(pet)}
                  className="bg-[#65cadc] text-white py-1 px-4 rounded-lg hover:bg-[#45A1C1]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pet.id)}
                  className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adoption Requests Section */}
      <div className="px-6 md:px-20 pb-20" id="adoption-requests">
        <h2 className="text-2xl font-bold text-[#65cadc] mb-6 text-center">
          Adoption Requests
        </h2>
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2"
              >
                <h3 className="text-lg font-bold text-[#65cadc]">
                  {request.user_name} wants to adopt {request.pet_name}
                </h3>
                <p className="text-gray-500">Contact: {request.user_contact}</p>
                <p className="text-gray-600">Message: {request.message}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleRequestAction(request.id, "approve")}
                    disabled={loadingStates[request.id] === "approve"}
                    className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600"
                  >
                    {loadingStates[request.id] === "approve" ? (
                      // <ClipLoader color="#fff" size={20} />
                      <HashLoader color="#fff" size={20} />
                    ) : (
                      "Accept"
                    )}
                  </button>

                  <button
                    onClick={() => handleRequestAction(request.id, "reject")}
                    disabled={loadingStates[request.id] === "reject"}
                    className="bg-orange-500 text-white py-1 px-4 rounded-lg hover:bg-orange-600"
                  >
                    {loadingStates[request.id] === "reject" ? (
                      // <ClipLoader color="#fff" size={20} />
                      <HashLoader color="#fff" size={20} />
                    ) : (
                      "Reject"
                    )}
                  </button>

                  <button
                    onClick={() => handleRequestDelete(request.id)}
                    className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No adoption requests available.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#65cadc] text-white py-6 text-center">
        <p>© 2024 Pet Connect. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Adoption;
