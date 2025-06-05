const nodemailer = require("nodemailer");

// Create a reusable email transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Or use another service (like SendGrid)
  auth: {
    user: process.env.ADMIN_EMAIL, // Replace with your email
    pass: process.env.ADMIN_PASSWORD, // Replace with your Gmail App Password
  },
});

// Function to send email
const sendEmail = (userEmail, reminderMessage) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL, // Replace with your email
    to: userEmail, // User's email to send the reminder
    subject: "Reminder Added",
    text: `You have successfully added a new reminder: ${reminderMessage}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendEmail };
