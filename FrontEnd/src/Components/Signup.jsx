import React, { useState } from "react";
import Logo from "../assets/Logo1.png";
import axios from "axios";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Default role, no input needed
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data:", formData); // Log data being sent
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        formData
      );
      alert("Signup successful! Please log in.");
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message); // Log error details
      alert(
        "Signup failed. Reason: " + (error.response?.data || "Unknown error")
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F9F9F9]">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md ">
        <div className="flex flex-col items-center gap-[2px] text-center">
          <img
            src={Logo}
            alt="pet grooming"
            className=" h-40 w-40 transform hover:scale-105 transition-transform duration-300 "
          />
          <h2 className="text-2xl font-bold mb-6 text-[#65cadc]">Sign Up</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700"></label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700"></label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700"></label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#65cadc] text-white py-2 rounded-lg hover:bg-[#45A1C1]"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-[#65cadc] underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
