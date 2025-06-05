const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASSWORD, // use App Password (not your Gmail password)
  },
});

const sendReminderEmail = (to, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendReminderEmail };
