// all requires
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const fs = require("fs");
const routes = require("./routes");
const PORT = require("./config/config.js").PORT;

// init
const app = express();

// middlewarre
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// welcome
app.get("/", (req, res) => {
  res.send("Welcome");
});

// routes
app.use("/api", routes);

// port
app.listen(PORT, () => {
  console.log("Listening on port:", PORT);
});

// call React build assest
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.use(express.static(path.join(__dirname, "frontend/build")));
