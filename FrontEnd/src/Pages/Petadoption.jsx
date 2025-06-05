import React, { useState, useEffect } from "react";
import {
  ClipLoader,
  PropagateLoader,
  PulseLoader,
  GridLoader,
} from "react-spinners";

const PetAdoption = () => {
  const [pets, setPets] = useState([]); // Initialize as an empty array
  const [filteredPets, setFilteredPets] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [request, setRequest] = useState({
    userName: "",
    userContact: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [message, setMessage] = useState(""); // Success or error message

  // Fetch pet data from the backend
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pets"); // Backend endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch pets");
        }
        const data = await response.json();
        setPets(data);
        setFilteredPets(data); // Initialize filteredPets with fetched data
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredPets(
      pets.filter(
        (pet) =>
          pet.name.toLowerCase().includes(query) ||
          pet.breed.toLowerCase().includes(query) ||
          pet.location.toLowerCase().includes(query)
      )
    );
  };

  const handleRequestChange = (e) => {
    setRequest({ ...request, [e.target.name]: e.target.value });
  };

  const handleRequestSubmit = async () => {
    const adoptionRequest = {
      petId: selectedPet.id, // Include the pet ID
      petName: selectedPet.name,
      userName: request.userName,
      userContact: request.userContact,
      message: request.message,
    };
    setIsLoading(true); // Show loading animation
    setMessage(""); // Clear previous messages

    try {
      const response = await fetch(
        "http://localhost:5000/api/pets/send-adoption-request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adoptionRequest),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit adoption request");
      }

      setShowModal(false);
      setRequest({ userName: "", userContact: "", message: "" });
      alert("Your adoption request has been submitted successfully!");
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      alert(
        "There was an issue submitting your request. Please try again later."
      );
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <header className="text-center py-4 bg-[#65cadc] text-white">
        <h1 className="text-4xl font-bold">Find Your Perfect Pet</h1>
        {/* <p className="mt-4 text-lg">
          Browse pets available for adoption and find your new best friend.
        </p> */}
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

      {/* Search Section */}
      <div className="px-6 md:px-20 py-10">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <input
            type="text"
            placeholder="Search by name, breed, or location"
            value={search}
            onChange={handleSearch}
            className="w-full md:w-1/2 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65cadc]"
          />
          <button
            onClick={() => setSearch("")}
            className="bg-[#65cadc] text-white py-2 px-6 rounded-lg hover:bg-[#45A1C1]"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Pet Profiles */}
      <div className="px-6 md:px-20 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPets.map((pet) => (
          <div
            key={pet.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform"
          >
            <img
              src={pet.image}
              alt={pet.name}
              className="h-64 w-full object-cover"
            />

            <div className="p-4">
              <h2 className="text-2xl font-bold text-[#65cadc]">{pet.name}</h2>
              <p className="text-gray-700 mt-1">{pet.breed}</p>
              <p className="text-gray-500 mt-1">{pet.age}</p>
              <p className="text-gray-500 mt-1">{pet.location}</p>
              <p className="text-gray-600 mt-3">{pet.description}</p>
              <button
                onClick={() => {
                  setSelectedPet(pet);
                  setShowModal(true);
                }}
                className="bg-[#65cadc] text-white py-2 px-4 mt-4 rounded-lg hover:bg-[#45A1C1]"
              >
                Contact for Adoption
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adoption Request */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#65cadc] mb-4">
              Request to Adopt {selectedPet.name}
            </h2>
            <input
              type="text"
              name="userName"
              placeholder="Your Name"
              value={request.userName}
              onChange={handleRequestChange}
              required
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65cadc]"
            />
            <input
              type="email"
              name="userContact"
              placeholder="Your Email"
              value={request.userContact}
              onChange={handleRequestChange}
              required
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65cadc]"
            />
            <textarea
              name="message"
              placeholder="Why do you want to adopt this pet?"
              value={request.message}
              onChange={handleRequestChange}
              required
              className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#65cadc]"
            ></textarea>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              {isLoading ? (
                // <div className="loading-spinner">Processing your request...</div>
                // <ClipLoader color="#36d7b7" loading={isLoading} size={50} />
                // <PropagateLoader color="#37bee9" loading={isLoading} size={10} />
                // <PulseLoader color="#36d7b7" loading={isLoading} size={15} />
                <GridLoader color="#36d7b7" size={10} loading={isLoading} />
              ) : (
                <button
                  onClick={handleRequestSubmit}
                  className="bg-[#65cadc] text-white py-2 px-4 rounded-lg hover:bg-[#45A1C1]"
                >
                  Submit Request
                </button>
              )}
              {message && <p>{message}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#65cadc] text-white py-6 text-center">
        <p>© 2024 Pet Connect. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default PetAdoption;
