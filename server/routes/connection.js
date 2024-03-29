const Connection = require("../models/Connection");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// create a new user connection for lobby if there isn't one, and deletes old connections
router.post("/", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    let check = false;

    for await (const doc of Connection.find()) {
      if (doc.createdAt < Date.now() - 100000) {
        await doc.remove();
      }
    }
    for await (const doc of Connection.find()) {
      if (doc.userId === req.body.userId) {
        check = true;
      }
    }
    if (
      !check &&
      decoded.userId === req.body.userId &&
      (await Connection.countDocuments({})) < 3
    ) {
      const connection = await new Connection(req.body).save();
      res.send(connection);
    } else {
      res.send("Unauthorized");
    }
  } catch (error) {
    res.send(error);
  }
});

// retrieves lobby user connections, and deletes old or extra connections
router.get("/", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

    for await (const doc of Connection.find()) {
      if (doc.createdAt < Date.now() - 100000) {
        await doc.remove();
      }
    }
    if (decoded) {
      let count = 0;
      for await (const doc of Connection.find()) {
        if (doc.userId === decoded.userId) {
          count++;
          if (count > 1) {
            await doc.remove();
          }
        }
      }
      const connections = await Connection.find();
      res.send(connections);
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
