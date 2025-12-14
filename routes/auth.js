const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err) => {
      if (err) {
        return res.status(400).json({ message: "User already exists" });
      }
      res.json({ message: "Signup successful" });
    }
  );
});
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, result[0].password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign({ id: result[0].id }, "secretkey");
      res.json({ token });
    }
  );
});
module.exports = router;
