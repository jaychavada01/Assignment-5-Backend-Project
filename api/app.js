const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

const authRoute = require("./routes/authRoute.js");
const { connectDB } = require("./config/database");
const { syncDB } = require("./models");

connectDB();
syncDB()

require("dotenv").config({ path: `${process.cwd()}/api/.env` });

const PORT = process.env.PORT || 3000;

//? Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cookieParser());

//? Routes
app.use("/users", authRoute);

app.use("*", (req, res, next) => {
  res.status(400).json({ message: "Invalid route!", status: "Fail" });
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Api started working!",
  });
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
