const Item = require("../models/Item");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  verifyUserkey,
  generateUserkey,
  generateFortifiedUserkey,
} = require("../libs/userkeyGeneratorAndVerifier.js");

// create a new user item record and deletes old item record
router.post("/", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    const verifiedUserkey = await verifyUserkey(decoded, req.headers.userkey);

    if (verifiedUserkey && decoded.userId === req.body.userId) {
      for await (const doc of Item.find()) {
        if (
          doc.userId === req.body.userId &&
          doc.itemId === req.body.itemId &&
          doc.type === req.body.type
        ) {
          await doc.remove();
        }
      }
      const item = await new Item(req.body).save();
      res.send(item);
      generateUserkey(decoded.userId);
    } else {
      res.send("Unauthorized");
      generateFortifiedUserkey(decoded.userId);
    }
  } catch (error) {
    res.send(error);
  }
});

// retrieves user item records
router.get("/", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

    if (decoded) {
      const items = await Item.find({ userId: decoded.userId });
      res.send(items);
    } else {
      res.send("Unauthorized");
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
