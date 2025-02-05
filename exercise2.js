// exercise2.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

const secretKey = "12345abc";

const user = { username: "test1", password: "password1" };
const posts = ["early bird catches the worm", "extra post"];
app.post("/exercise2/signin", (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: "15m" });
    return res.json({ accessToken: token });
  }
  res.status(401).send("Invalid");
});

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("No token provided");

  const parts = authHeader.split(" ");
  if (parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).send("Token error");
  }

  const token = parts[1];
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).send("Failed auth token");
    req.user = decoded;
    next();
  });
}

app.get("/exercise2/posts", verifyToken, (req, res) => {
  res.json(posts);
});

app.listen(port, () => {
  console.log(`Server run on port ${port}`);
});
