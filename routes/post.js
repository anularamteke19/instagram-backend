const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();


router.post("/create", auth, (req, res) => {
  const { imageUrl, caption } = req.body;
  const userId = req.userId;

  db.query(
    "INSERT INTO posts (user_id, image_url, caption) VALUES (?, ?, ?)",
    [userId, imageUrl, caption],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Post creation failed" });
      }
      res.json({ message: "Post created successfully" });
    }
  );
});


router.get("/feed", auth, (req, res) => {
  db.query(
    "SELECT * FROM posts ORDER BY id DESC",
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Feed error" });
      }
      res.json(result);
    }
  );
});


router.post("/like/:postId", auth, (req, res) => {
  const userId = req.userId;
  const postId = req.params.postId;

  db.query(
    "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
    [userId, postId],
    (err) => {
      if (err) {
        return res.status(400).json({ message: "Already liked" });
      }
      res.json({ message: "Post liked" });
    }
  );
});


router.post("/comment/:postId", auth, (req, res) => {
  const userId = req.userId;
  const postId = req.params.postId;
  const { text } = req.body;

  db.query(
    "INSERT INTO comments (user_id, post_id, text) VALUES (?, ?, ?)",
    [userId, postId, text],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Comment failed" });
      }
      res.json({ message: "Comment added" });
    }
  );
});




module.exports = router;
