const express = require("express");

const app = express();

const port = 8000;

// Documentation
// https://expressjs.com/en/starter/hello-world.html

// other type of requets are app. get, app.post, app.put, app.delete
app.get("/", (req, res) => {
  return res.send("Home Page");
});

const admin = (req, res) => {
  return res.send("this is admin dashboard");
};

const isloggedIn = (req, res, next) => {
  return res.send("isloggedIn is running");
  next();
};

const isAdmin = (req, res, next) => {
  return res.send("isAdmin is running");
  next(); // customised middleware
};

app.get("/admin", isloggedIn, isAdmin, admin);

app.get("/login", (req, res) => {
  return res.send("You are visting login route");
});

app.get("/signup", (req, res) => {
  return res.send("You are visting signup route");
});

app.listen(port, () => {
  console.log("Server is up and running...");
});

// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })
