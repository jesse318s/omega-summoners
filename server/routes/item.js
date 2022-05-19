const Item = require("../models/item");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
        if (decoded.userId === req.body.userId) {
            for await (const doc of Item.find()) {
                if (doc.userId === req.body.userId && doc.itemId === req.body.itemId && doc.type === req.body.type) {
                    await doc.remove();
                }
            }
            const item = await new Item(req.body).save();
            res.send(item);
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
            const items = await Item.find({ userId: decoded.userId });
            res.send(items);
        }
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;