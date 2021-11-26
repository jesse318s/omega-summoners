const User = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const user = await new User(req.body).save();
        res.send(user);
    } catch (error) {
        res.send(error);
    }
});

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.send(error);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            req.body
        );
        res.send(user);
    } catch (error) {
        res.send(error);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.send(user);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;