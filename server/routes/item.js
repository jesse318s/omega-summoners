const Item = require("../models/item");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");

// create a new user item record and deletes old item record
router.post("/", async (req, res) => {
  try {
    const options = {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${process.env.USERFRONT_KEY}`,
      },
    };
    const payload = {
      data: {
        userkey: Math.random().toString(36).substring(7),
      },
    };

    function getUserkey() {
      return axios
        .get(
          "https://api.userfront.com/v0/users/" + req.headers.userid,
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
    if (
      decoded.userId === req.body.userId &&
      req.headers.userkey === userkey.data.userkey
    ) {
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
    } else {
      res.send("Unauthorized");
    }
    function putUserkey() {
      return axios
        .put(
          "https://api.userfront.com/v0/users/" + req.headers.userid,
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
