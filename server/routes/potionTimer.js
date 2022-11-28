const PotionTimer = require("../models/potionTimer");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  verifyUserkey,
  generateUserkey,
  generateQuantumUserkey,
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
    if (!check && verifiedUserkey) {
      const potionTimer = await new PotionTimer(req.body).save();
      res.send(potionTimer);
      generateUserkey(decoded.userId);
    } else {
      res.send("Unauthorized");
      generateQuantumUserkey(decoded.userId);
    }
  } catch (error) {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

    res.send(error);
    generateQuantumUserkey(decoded.userId);
  }
});

// retrieves user potion timer and deletes old or extra timers
router.get("/", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

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
      const potionTimers = await PotionTimer.find();
      res.send(potionTimers);
    }
    for await (const doc of PotionTimer.find()) {
      if (doc.createdAt < Date.now() - doc.potionDuration) {
        await doc.remove();
      }
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
