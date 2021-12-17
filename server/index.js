const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const creatures = require("./routes/creatures");
const users = require("./routes/users");

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.once("open", () => { console.log("MongoDB database connection established successfully.") });

app.use(express.json());
app.use(cors());
app.use(compression());

app.use("/api/creatures", creatures);
app.use("/api/users", users);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));