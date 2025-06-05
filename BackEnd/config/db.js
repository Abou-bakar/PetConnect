const mysql = require("mysql");

const connectDatabase = () => {
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "petconnect",
  });

  db.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err);
      process.exit(1);
    }
    console.log("Connected to MySQL database.");
  });

  return db;
};

module.exports = { connectDatabase };
