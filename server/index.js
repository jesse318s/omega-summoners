const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const user = require("./routes/user");
const lobby = require("./routes/lobby");
const connectionRecord = require("./routes/connection");
const item = require("./routes/item");
const potionTimer = require("./routes/potionTimer");

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.once("open", () => { console.log("MongoDB database connection established successfully.") });

app.use(express.json());
app.use(cors());
app.use(compression());

app.use("/api/user", user);
app.use("/api/lobby", lobby);
app.use("/api/connection", connectionRecord);
app.use("/api/item", item);
app.use("/api/potionTimer", potionTimer);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));