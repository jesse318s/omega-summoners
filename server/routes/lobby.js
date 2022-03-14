const Lobby = require("../models/lobby");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/:id", async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
        if (decoded) {
            const lobby = await Lobby.findOne({ _id: req.params.id });
            if (lobby.enemyHP <= 0) {
                await Lobby.findOneAndUpdate(
                    {
                        _id: req.params.id
                    },
                    {
                        enemyHP: lobby.maxHP,
                    }
                );
            }
            res.send(lobby);
        }
    } catch (error) {
        res.send(error);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const lobbyCheck = await Lobby.findOne({ _id: req.params.id });
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
        if (decoded && req.body.enemyHP < lobbyCheck.enemyHP) {
            const lobby = await Lobby.findOneAndUpdate(
                {
                    _id: req.params.id
                },
                {
                    enemyHP: req.body.enemyHP,
                }
            );
            res.send(lobby);
        } else {
            res.send("Unauthorized");
        }
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;