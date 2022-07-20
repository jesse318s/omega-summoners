const connection = require("./db");
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

// make connection
connection();

// use packages
app.use(express.json());
app.use(cors());
app.use(compression());

// use routes
app.use("/api/user", user);
app.use("/api/lobby", lobby);
app.use("/api/connection", connectionRecord);
app.use("/api/item", item);
app.use("/api/potionTimer", potionTimer);

// listen for connection
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));