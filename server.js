const express = require("express");
const cors = require("cors");
const db = require("./db");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/user", userRoutes);


app.get("/", (req, res) => {
  res.send("Instagram Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
