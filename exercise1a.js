const express = require("express");
const app = express();
const port = 3000;

const Username = "hello";
const Password = "world";

app.get("/exercise1a/httpbasic", (req, res) => {
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
  res.send("protected route");
});

app.listen(port, () => {
  console.log(`Server run port ${port}`);
});
