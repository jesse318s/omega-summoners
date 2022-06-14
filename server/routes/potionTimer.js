const PotionTimer = require("../models/potionTimer");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require('axios');

// creates a new user potion timer if there isn't one
router.post("/", async (req, res) => {
    try {
        const options = {
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${process.env.USERFRONT_KEY}`
            }
        };
        const payload = {
            data: {
                userkey: Math.random().toString(36).substring(7),
            }
        };
        function getUserkey() {
            return axios.get("https://api.userfront.com/v0/users/" + req.headers.userid, options)
                .then((response) => {
                    return response.data;
                })
                .catch((err) => console.error(err));
        }
        const userkey = await getUserkey();
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
        let check = false;
        for await (const doc of PotionTimer.find()) {
            if (doc.userId === req.body.userId) {
                check = true;
            }
        }
        if (!check && decoded.userId === req.body.userId && req.headers.userkey === userkey.data.userkey) {
            const potionTimer = await new PotionTimer(req.body).save();
            res.send(potionTimer);
        } else {
            res.send("Unauthorized");
        }
        function putUserkey() {
            return axios.put("https://api.userfront.com/v0/users/" + req.headers.userid, payload, options)
                .catch((err) => console.error(err));
        }
        await putUserkey();
    } catch (error) {
        res.send(error);
    }
});

// retrieves user potion timer and deletes old or extra timers
router.get("/", async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
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