// exercise4.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

const accessTokenSecret = "12345abc";
const refreshTokenSecret = "12345abc_refresh";
let refreshTokens = [];

const users = [
  { username: "admin", password: "adminpass", role: "admin" },
  { username: "user", password: "userpass", role: "user" },
];

app.post("/exercise4/signin", (req, res) => {
  const { username, password } = req.body;
  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!foundUser) {
    return res.status(401).send("Invalid");
  }
  const accessToken = jwt.sign(
    { username: foundUser.username, role: foundUser.role },
    accessTokenSecret,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username, role: foundUser.role },
    refreshTokenSecret,
    { expiresIn: "7d" }
  );

  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("Dont have token");

  const parts = authHeader.split(" ");
  if (parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).send("Token error");
  }

  const token = parts[1];
  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) return res.status(401).send("Fail to auth token");
    req.user = decoded;
    next();
  });
}

app.post("/exercise4/token", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).send("dont have token");
  if (!refreshTokens.includes(token)) {
    return res.status(403).send("Refresh token not valid");
  }
  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) return res.status(403).send("Token invalid");
    const { username, role } = user;
    const newAccessToken = jwt.sign({ username, role }, accessTokenSecret, {
      expiresIn: "15m",
    });
    res.json({ accessToken: newAccessToken });
  });
});

app.post("/exercise4/logout", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).send("dont have token");
  if (!refreshTokens.includes(token)) {
    return res.status(403).send("Refresh token not valid");
  }
  refreshTokens = refreshTokens.filter((rt) => rt !== token);
  res.sendStatus(204);
});

app.get("/exercise4/posts", verifyAccessToken, (req, res) => {
  res.json(["early bird catches the worm", "extra post"]);
});

app.listen(port, () => {
  console.log(`Server run port ${port}`);
});
