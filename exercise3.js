// exercise3.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

const secretKey = "12345abc";

const users = [
  { username: "admin", password: "adminpass", role: "admin" },
  { username: "user", password: "userpass", role: "user" },
];

let posts = ["early bird catches the worm", "extra post"];

app.post("/exercise3/signin", (req, res) => {
  const { username, password } = req.body;
  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!foundUser) {
    return res.status(401).send("Invalid");
  }
  const token = jwt.sign(
    { username: foundUser.username, role: foundUser.role },
    secretKey,
    { expiresIn: "15m" }
  );
  res.json({ accessToken: token });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("dont have token");

  const parts = authHeader.split(" ");
  if (parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).send("token error");
  }

  const token = parts[1];
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).send("Failed auth token");
    req.user = decoded;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).send("denied: Admins only");
  }
  next();
}

app.get("/exercise3/posts", verifyToken, (req, res) => {
  res.json(posts);
});

app.post("/exercise3/posts", verifyToken, requireAdmin, (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send("Message is required");
  posts.push(message);
  res.send("Post added");
});

app.listen(port, () => {
  console.log(`Server run port ${port}`);
});
