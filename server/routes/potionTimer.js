const PotionTimer = require("../models/potionTimer");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  verifyUserkey,
  generateUserkey,
  generateFortifiedUserkey,
} = require("../libs/userkeyGeneratorAndVerifier.js");

// creates a new user potion timer if there isn't one
router.post("/", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    const verifiedUserkey = await verifyUserkey(decoded, req.headers.userkey);
    let check = false;

    for await (const doc of PotionTimer.find()) {
      if (doc.userId === req.body.userId) {
        check = true;
      }
    }
    if (!check && verifiedUserkey && decoded.userId === req.body.userId) {
      const potionTimer = await new PotionTimer(req.body).save();
      res.send(potionTimer);
      generateUserkey(decoded.userId);
    } else {
      res.send("Unauthorized");
      generateFortifiedUserkey(decoded.userId);
    }
  } catch (error) {
    res.send(error);
  }
});

// retrieves user potion timer and deletes old or extra timers
router.get("/", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

    for await (const doc of PotionTimer.find()) {
      if (doc.createdAt < Date.now() - doc.potionDuration) {
        await doc.remove();
      }
    }
    if (decoded) {
      let count = 0;
      for await (const doc of PotionTimer.find()) {
        if (doc.userId === decoded.userId) {
          count++;
          if (count > 1) {
            await doc.remove();
          }
        }
      }
      const potionTimer = await PotionTimer.find({ userId: decoded.userId });
      res.send(potionTimer);
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
