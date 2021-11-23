const Creature = require("../models/creature");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const creature = await new Creature(req.body).save();
        res.send(creature);
    } catch (error) {
        res.send(error);
    }
});

router.get("/", async (req, res) => {
    try {
        const creatures = await Creature.find();
        res.send(creatures);
    } catch (error) {
        res.send(error);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const creature = await Creature.findOneAndUpdate(
            { _id: req.params.id },
            req.body
        );
        res.send(article);
    } catch (error) {
        res.send(error);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const creature = await Creature.findByIdAndDelete(req.params.id);
        res.send(creature);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;