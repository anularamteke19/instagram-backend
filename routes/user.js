const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");


router.post("/follow/:id", auth, (req, res) => {
  const followerId = req.userId;
  const followingId = req.params.id;

  db.query(
    "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)",
    [followerId, followingId],
    (err) => {
      if (err) {
        return res.status(400).json({ message: "Already following" });
      }
      res.json({ message: "User followed" });
    }
  );
});


router.post("/unfollow/:id", auth, (req, res) => {
  const followerId = req.userId;
  const followingId = req.params.id;

  db.query(
    "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
    [followerId, followingId],
    () => {
      res.json({ message: "User unfollowed" });
    }
  );
});


router.get("/all", auth, (req, res) => {
  db.query(
    `
    SELECT users.id, users.username,
    IF(follows.follower_id IS NULL, 0, 1) AS isFollowing
    FROM users
    LEFT JOIN follows
      ON users.id = follows.following_id
      AND follows.follower_id = ?
    WHERE users.id != ?
    `,
    [req.userId, req.userId],
    (err, result) => {
      res.json(result);
    }
  );
});

module.exports = router;
