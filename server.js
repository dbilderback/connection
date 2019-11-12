const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();

//Connect DB
connectDB();
if (process.env.NODE_ENV === "test") {
  connectDB.unref();
}

// Init Middleware
app.use(
  express.json({
    extended: false
  })
);

app.use(cors());

app.get("/", (req, res) => res.send("API Running"));

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log("Server Started"));
}

exports = module.exports = app;
