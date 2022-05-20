const PotionTimer = require("../models/potionTimer");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
        var check = false;
        for await (const doc of PotionTimer.find()) {
            if (doc.userId === req.body.userId) {
                check = true;
            }
        }
        if (!check && decoded.userId === req.body.userId) {
            const potionTimer = await new PotionTimer(req.body).save();
            res.send(potionTimer);
        } else {
            res.send("Unauthorized");
        }
    } catch (error) {
        res.send(error);
    }
});

router.get("/", async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
        if (decoded) {
            var count = 0;
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