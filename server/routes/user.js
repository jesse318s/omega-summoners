const User = require("../models/user");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  verifyUserkey,
  generateUserkey,
  generateFortifiedUserkey,
} = require("../libs/userkeyGeneratorAndVerifier.js");

// creates a new user if there isn't one
router.post("/", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    const user = await User.findOne({ userfrontId: decoded.userId });

    if (
      !user &&
      decoded.userId === req.body.userfrontId &&
      req.body.avatarPath === "img/avatar/placeholder_avatar.png" &&
      req.body.experience === 0 &&
      req.body.drachmas === 0 &&
      req.body.creatureId === 0 &&
      req.body.relics[0] === 1 &&
      req.body.chosenRelic === 1
    ) {
      const user = await new User(req.body).save();
      res.send(user);
      generateUserkey(decoded.userId);
    } else {
      res.send("Unauthorized");
    }
  } catch (error) {
    res.send(error);
  }
});

// gets user data
router.get("/", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    const user = await User.findOne({ userfrontId: decoded.userId });

    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

// updates user data
router.put("/:id", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    const verifiedUserkey = await verifyUserkey(decoded, req.headers.userkey);

    if (verifiedUserkey) {
      const user = await User.findOneAndUpdate(
        {
          _id: req.params.id,
          userfrontId: decoded.userId,
        },
        req.body
      );
      res.send(user);
      generateUserkey(decoded.userId);
    } else {
      res.send("Unauthorized");
      generateFortifiedUserkey(decoded.userId);
    }
  } catch (error) {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

    res.send(error);
    generateFortifiedUserkey(decoded.userId);
  }
});

module.exports = router;
