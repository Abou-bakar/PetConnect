import React from "react";
import Logo1 from "./assets/logo1.png";

const ContactForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    try {
      const response = await fetch("http://localhost:5000/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        form.reset();
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center gap-[2px] text-center">
        <img
          src={Logo1}
          alt="pet grooming"
          className="rounded-full h-40 w-40 transform hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h1 className="text-2xl font-bold text-center text-[#65cadc] mb-6">
        Contact Us
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <input
            type="text"
            name="subject"
            placeholder="Enter the subject"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <textarea
            name="message"
            placeholder="Write your message here"
            required
            className="w-full px-4 py-2 border rounded-lg h-32"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-[#65cadc] text-white py-2 rounded-lg hover:bg-[#45A1C1]"
        >
          Send Message
        </button>
      </form>
      <div className="text-center text-sm text-gray-500 mt-4">
        <p>&copy; 2024 PetConnect. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default ContactForm;
