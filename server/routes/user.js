const User = require("../models/user");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");

const options = {
  headers: {
    Accept: "*/*",
    Authorization: `Bearer ${process.env.USERFRONT_KEY}`,
  },
};

// creates a new user if there isn't one
router.post("/", async (req, res) => {
  try {
    const payload = {
      data: {
        userkey: Math.random().toString(36).substring(7),
      },
    };
    function putUserkey() {
      return axios
        .put(
          "https://api.userfront.com/v0/users/" + req.body.userfrontId,
          payload,
          options
        )
        .catch((err) => console.error(err));
    }
    await putUserkey();
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
    const payload = {
      data: {
        userkey: Math.random().toString(36).substring(7),
      },
    };
    function getUserkey() {
      return axios
        .get(
          "https://api.userfront.com/v0/users/" + req.body.userfrontId,
          options
        )
        .then((response) => {
          return response.data;
        })
        .catch((err) => console.error(err));
    }
    const userkey = await getUserkey();
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    if (req.headers.userkey === userkey.data.userkey && decoded) {
      const user = await User.findOneAndUpdate(
        {
          _id: req.params.id,
          userfrontId: decoded.userId,
        },
        req.body
      );
      res.send(user);
    } else {
      res.send("Unauthorized");
    }
    function putUserkey() {
      return axios
        .put(
          "https://api.userfront.com/v0/users/" + req.body.userfrontId,
          payload,
          options
        )
        .catch((err) => console.error(err));
    }
    await putUserkey();
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
