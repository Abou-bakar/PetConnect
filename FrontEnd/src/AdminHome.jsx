import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Importing Link for navigation
import Logo1 from "./assets/logo1.png";
import pic from "./assets/pic11.png.png";
import adopt from "./assets/petadoption.jpg";
import health from "./assets/pethealth.png";
import social from "./assets/petsocial.jpeg";
import events from "./assets/petevents.jpeg";
// import PetHealth from "./Admin/PetHealth";

const AdminHome = ({}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      navigate("/home"); // Redirect non-admins
    }
  }, [navigate]);
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Navbar */}
      <header className="flex flex-wrap justify-between items-center px-6 md:px-20 py-0 bg-[#F9F9F9] text-[#65cadc]">
        <div className="flex items-center gap-[2px]">
          <img className="h-20 w-20 " src={Logo1} alt="pet grooming" />
          <div className="text-2xl font-bold">Pet Connect</div>
        </div>
        <nav className="flex space-x-6 font-semibold">
          <Link to="/adminhome" className="hover:text-[#45A1C1]">
            Home
          </Link>
          <Link to="/adoption" className="hover:text-[#45A1C1]">
            Adoption
          </Link>
          <Link to="/admin/health-tracker" className="hover:text-[#45A1C1]">
            Admin Health Tracker
          </Link>
          <Link to="/petsocial" className="hover:text-[#45A1C1]">
            Social Network
          </Link>
          <Link to="/AdminPetEvents" className="hover:text-[#45A1C1]">
            Events
          </Link>
          <Link to="/login" className="hover:text-[#45A1C1]">
            Log out
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-32 bg-[#65cadc]">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F9F9F9] mb-4">
            Welcome! To Pet Connect Admin Page
          </h1>
          <p className="text-lg text-gray-700 mb-6">petconnect021@gmail.com</p>
          <a
            href="#what-we-offer"
            className="bg-[#F9F9F9] text-[#65cadc] font-semibold shadow-2xl py-2 px-6 rounded-full hover:bg-[#45A1C1]"
          >
            Explore Features
          </a>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img src={pic} alt="Pets at home" className="rounded-lg" />
        </div>
      </main>

      {/* Features Section */}
      <section
        className="px-6 py-20 bg-gray-100 min-h-screen pt-6"
        id="what-we-offer"
      >
        <h2 className="text-4xl font-bold text-center pb-8 text-[#65cadc] mb-8">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold text-[#65cadc] mb-2">
              Pet Adoption
            </h3>
            <p className="text-gray-600 mb-4">
              Find the perfect pet for your home. Browse our list of pets
              looking for a family.
              <div>
                <img
                  src={adopt}
                  alt="grooming"
                  className="rounded-lg shadow-md bg-white h-64 w-72 "
                />
              </div>
            </p>
            <Link
              to="/adoption"
              className="bg-[#65cadc] text-white py-2  px-4 rounded hover:bg-[#45A1C1]"
            >
              Browse Pets
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold text-[#65cadc] mb-2">
              Health Tracker
            </h3>
            <p className="text-gray-600 mb-4">
              Keep track of your pet's health, appointments, and vaccinations.
              <div>
                <img
                  src={health}
                  alt="gromming"
                  className="rounded-lg shadow-md bg-white h-64 w-72 mt-6"
                />
              </div>
            </p>
            <Link
              to="/AdminPetHealth"
              className="bg-[#65cadc] text-white py-2 px-4 rounded hover:bg-[#45A1C1]"
            >
              Start Tracking
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold text-[#65cadc] mb-2">
              Pet Social Network
            </h3>
            <p className="text-gray-600 mb-4">
              Connect with other pet owners, share stories, and make friends for
              your furry buddy.
              <div>
                <img
                  src={social}
                  alt="gromming"
                  className="rounded-lg shadow-md bg-white h-64 w-72 "
                />
              </div>
            </p>

            <Link
              to="/petsocial"
              className="bg-[#65cadc] text-white py-2 px-4 rounded hover:bg-[#45A1C1]"
            >
              Join Network
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold text-[#65cadc] mb-2">
              Pet Events
            </h3>
            <p className="text-gray-600 mb-4">
              Discover pet-friendly events near you or host your own!
              <div>
                <img
                  src={events}
                  alt="grooming"
                  className="rounded-lg shadow-md bg-white h-64 w-72 mt-6 "
                />
              </div>
            </p>

            <Link
              to="/AdminPetEvents"
              className="bg-[#65cadc] text-white py-2 px-4 rounded hover:bg-[#45A1C1]"
            >
              View Events
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#65cadc] text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            {/* Logo and Copyright */}
            <div className="flex flex-col items-center md:items-start">
              <img src={Logo1} alt="Pet Connect Logo" className="h-20 mb-4" />
              <p>© 2024 Pet Connect. All Rights Reserved.</p>
            </div>

            {/* Contact Information */}
            <div>
              <h5 className="font-bold text-lg mb-4">Contact Us</h5>
              <ul>
                <li>
                  <a
                    href="mailto:info@petconnect.com"
                    className="hover:text-[#45A1C1]"
                  >
                    Email: petconnect021@gmail.com
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#45A1C1]">
                    Contact Form
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media Links */}
            <div>
              <h5 className="font-bold text-lg mb-4">Follow Us</h5>
              <div className="flex justify-center md:justify-start space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-gray-300"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-gray-300"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="hover:text-gray-300"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-gray-300"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminHome;
