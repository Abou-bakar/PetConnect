// utils/emailService.js
const nodemailer = require("nodemailer");

// Configure SMTP (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Store in .env
    pass: process.env.EMAIL_PASSWORD, // Store in .env
  },
});

// Email template for new event
const sendEventNotification = async (userEmail, eventDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "New Event Alert: PetConnect",
    html: `
      <h2>New Event: ${eventDetails.title}</h2>
      <p><strong>Date:</strong> ${eventDetails.date}</p>
      <p><strong>Description:</strong> ${eventDetails.description}</p>
      <img src="http://localhost:5000${eventDetails.image_url}" alt="Event Image" width="200"/>
      <p>Visit our website for details!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Failed to send email to ${userEmail}:`, error);
  }
};

module.exports = { sendEventNotification };