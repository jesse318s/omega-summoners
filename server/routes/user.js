const User = require("../models/user");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
        if (decoded.userId === req.body.userfrontId &&
            req.body.avatarPath === "img/avatar/placeholder_avatar.png" &&
            req.body.experience === 0 &&
            req.body.drachmas === 0 &&
            req.body.creatureId === 0 &&
            req.body.relics[0] === 1 &&
            req.body.chosenRelic === 1) {
            const user = await new User(req.body).save();
            res.send(user);
        }
    } catch (error) {
        res.send(error);
    }
});

router.get("/", async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
        const user = await User.findOne({ userfrontId: decoded.userId });
        res.send(user);
    } catch (error) {
        res.send(error);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
        if (decoded) {
            const user = await User.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userfrontId: decoded.userId
                },
                req.body
            );
            res.send(user);
        }
    } catch (error) {
        res.send(error);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
        if (decoded) {
            const user = await User.findOneAndDelete({
                _id: req.params.id,
                userfrontId: decoded.userId
            });
            res.send(user);
        }
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;