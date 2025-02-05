const express = require("express");
const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;
const app = express();
const port = 3000;

const Username = "hello";
const Password = "world";

passport.use(
  new BasicStrategy((username, password, done) => {
    console.log(`username: ${username} password: ${password}`);
    if (username !== Username) {
      return done(null, false, { message: "Username not match" });
    }
    if (password !== Password) {
      return done(null, false, { message: "Password not correct" });
    }
    return done(null, { username });
  })
);

app.use(passport.initialize());

app.get("/exercise1c/public", (req, res) => {
  res.send("Hello from public");
});

app.get(
  "/exercise1c/httpbasic",
  passport.authenticate("basic", { session: false }),
  (req, res) => {
    res.send("Hello from httpbasic");
  }
);

app.get(
  "/exercise1c/anotherhttpbasic",
  passport.authenticate("basic", { session: false }),
  (req, res) => {
    res.send("Hello from anotherhttpbasic");
  }
);

app.listen(port, () => {
  console.log(`Server run port ${port}`);
});
