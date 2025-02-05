const express = require("express");
const app = express();
const port = 3000;

const Username = "hello";
const Password = "world";

function basicAuthMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send("authorization header miss");
  }

  const parts = authHeader.split(" ");
  if (parts[0] !== "Basic" || !parts[1]) {
    return res.status(401).send("Invalid authorization");
  }

  const encodedCredentials = parts[1];
  const buffer = Buffer.from(encodedCredentials, "base64");
  const credentials = buffer.toString("ascii");
  const [username, password] = credentials.split(":");

  console.log(`username: ${username} password: ${password}`);

  if (username !== Username) {
    return res.status(401).send("Username not match");
  }
  if (password !== Password) {
    return res.status(401).send("Password not correct");
  }
  next();
}

app.get("/exercise1b/public", (req, res) => {
  res.send("Hello from public");
});

app.get("/exercise1b/httpbasic", basicAuthMiddleware, (req, res) => {
  res.send("Hello from httpbasic");
});

app.get("/exercise1b/anotherhttpbasic", basicAuthMiddleware, (req, res) => {
  res.send("Hello from anotherhttpbasic");
});

app.listen(port, () => {
  console.log(`Server run port ${port}`);
});
