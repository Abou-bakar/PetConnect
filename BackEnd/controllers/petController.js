const { connectDatabase } = require("../config/db");
const db = connectDatabase();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config(); // Load .env variables

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});

module.exports = transporter;

const getAllPets = (req, res) => {
  db.query("SELECT * FROM pets", (err, results) => {
    if (err) return res.status(500).send("Database error.");
    const petsWithImageUrls = results.map((pet) => ({
      ...pet,
      image: pet.image ? `http://localhost:5000/uploads/${pet.image}` : null,
    }));
    res.json(petsWithImageUrls);
  });
};

const addPet = (req, res) => {
  const { name, breed, age, location, description } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !breed || !age || !location || !description || !image) {
    return res
      .status(400)
      .json({ message: "All fields are required, including the image." });
  }

  const sql =
    "INSERT INTO pets (name, breed, age, location, description, image) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, breed, age, location, description, image], (err) => {
    if (err) return res.status(500).json({ message: "Failed to add pet" });
    res.status(201).json({ message: "Pet added successfully!" });
  });
};

const updatePet = (req, res) => {
  const { id } = req.params;
  const { name, breed, age, location, description } = req.body;
  let query = "UPDATE pets SET";
  const queryParams = [];

  if (name) {
    query += " name = ?,";
    queryParams.push(name);
  }
  if (breed) {
    query += " breed = ?,";
    queryParams.push(breed);
  }
  if (age) {
    query += " age = ?,";
    queryParams.push(age);
  }
  if (location) {
    query += " location = ?,";
    queryParams.push(location);
  }
  if (description) {
    query += " description = ?,";
    queryParams.push(description);
  }
  if (req.file) {
    query += " image = ?,";
    queryParams.push(req.file.filename);
  }

  query = query.slice(0, -1) + " WHERE id = ?";
  queryParams.push(id);

  db.query(query, queryParams, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to update pet." });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Pet not found." });
    res.status(200).json({ message: "Pet updated successfully!" });
  });
};

const deletePet = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM pets WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send("Database error.");
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Pet not found." });
    res.status(200).json({ message: "Pet deleted successfully." });
  });
};

const sendAdoptionRequest = (req, res) => {
  const { petId, petName, userName, userContact, message } = req.body;

  if (!petId || !petName || !userName || !userContact) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Save request to the database
  const sql = `INSERT INTO adoption_requests (pet_id, pet_name, user_name, user_contact, message) VALUES (?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [petId, petName, userName, userContact, message],
    (err, result) => {
      if (err) {
        console.error("Error saving adoption request:", err);
        return res
          .status(500)
          .json({ message: "Failed to save adoption request." });
      }

      // Send email to admin
      const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: process.env.ADMIN_EMAIL, // Admin's email
        subject: `Adoption Request for ${petName}`,
        text: `
        A user has requested to adopt a pet.

        Pet Details:
        Name: ${petName}
        Pet ID: ${petId}

        User Details:
        Name: ${userName}
        Email: ${userContact}

        Message:
        ${message}
      `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email to admin:", err);
          return res
            .status(500)
            .json({ error: "Failed to send email to admin" });
        }

        console.log("Adoption request email sent to admin:", info.response);
        res
          .status(201)
          .json({
            message: "Adoption request submitted and email sent to admin!",
          });
      });
    }
  );
};

const getAdoptionRequests = (req, res) => {
  const sql = "SELECT * FROM adoption_requests";
  db.query(sql, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Failed to fetch adoption requests." });
    res.status(200).json(results);
  });
};

const approveRequest = (req, res) => {
  const { id } = req.params;

  const fetchRequestQuery = "SELECT * FROM adoption_requests WHERE id = ?";
  db.query(fetchRequestQuery, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Adoption request not found." });
    }

    const request = results[0];
    const userEmail = request.user_contact;

    const approveQuery =
      "UPDATE adoption_requests SET status = 'approved' WHERE id = ?";
    db.query(approveQuery, [id], (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to approve adoption request." });
      }

      // Send approval email to user
      const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: userEmail,
        subject: "Adoption Request Approved",
        text: `
          Dear ${request.user_name},

          Your adoption request for the pet "${request.pet_name}" has been approved!
          Please contact us for further details.

          Best regards,
          PetConnect Team
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending approval email:", err);
          return res
            .status(500)
            .json({ message: "Request approved, but email failed." });
        }

        console.log("Approval email sent to user:", info.response);
        res
          .status(200)
          .json({ message: "Request approved and email sent to user!" });
      });
    });
  });
};

const rejectRequest = (req, res) => {
  const { id } = req.params;

  const fetchRequestQuery = "SELECT * FROM adoption_requests WHERE id = ?";
  db.query(fetchRequestQuery, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Adoption request not found." });
    }

    const request = results[0];
    const userEmail = request.user_contact;

    const rejectQuery =
      "UPDATE adoption_requests SET status = 'rejected' WHERE id = ?";
    db.query(rejectQuery, [id], (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to reject adoption request." });
      }

      // Send rejection email to user
      const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: userEmail,
        subject: "Adoption Request Rejected",
        text: `
          Dear ${request.user_name},

          Unfortunately, your adoption request for the pet "${request.pet_name}" has been rejected.
          Thank you for your understanding.

          Best regards,
          PetConnect Team
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending rejection email:", err);
          return res
            .status(500)
            .json({ message: "Request rejected, but email failed." });
        }

        console.log("Rejection email sent to user:", info.response);
        res
          .status(200)
          .json({ message: "Request rejected and email sent to user!" });
      });
    });
  });
};

const deleteRequest = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM adoption_requests WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Failed to delete adoption request." });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Adoption request not found." });
    res.status(200).json({ message: "Adoption request deleted successfully!" });
  });
};

module.exports = {
  getAllPets,
  addPet,
  updatePet,
  deletePet,
  sendAdoptionRequest,
  getAdoptionRequests,
  approveRequest,
  rejectRequest,
  deleteRequest,
};
