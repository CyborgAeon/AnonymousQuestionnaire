const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Configuration for the database connection
const dbConfig = {
  port: 1433,
  user: "NCDMZ\\BRBAR",
  password: "--",
  server: "localhost\\PF3ZSP4K",
  database: "Questionnaire",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Endpoint for getting all surveys
app.get("/surveys", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM surveys");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error executing SQL query:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Endpoint for creating a new survey
app.post("/surveys", async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("title", sql.NVarChar, title)
      .input("description", sql.NVarChar, description || null)
      .query(
        "INSERT INTO surveys (title, description) VALUES (@title, @description)"
      );

    res.json({
      message: "Survey created successfully",
      surveyId: result.recordset[0].surveyId,
    });
  } catch (err) {
    console.error("Error executing SQL query:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Add other endpoints for updating and deleting surveys as needed.

// Start the server
app.listen(() => {});
