import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo1 from "../assets/logo.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    // role: "user", // default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.status === 200) {
        localStorage.clear(); // clear previous data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role); // ✅ save role too
        const userRole = response.data.role;
        console.log("🔁 Logged-in Role:", userRole);

        if (userRole === "admin") {
          navigate("/adminhome");
        } else if (userRole === "user") {
          navigate("/home");
        } else {
          alert("Unknown role");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert(err?.response?.data || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F9F9F9]">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center gap-[2px] text-center">
          <img
            src={logo1}
            alt="pet grooming"
            className="rounded-full h-40 w-40 transform hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-[#65cadc]">
          Log In
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              placeholder="Enter your email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <input
              placeholder="Enter your password"
              type="password"
              name="password"
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
            Log In
          </button>
        </form>
        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-[#65cadc] underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
