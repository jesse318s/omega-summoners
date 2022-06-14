const Lobby = require("../models/lobby");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require('axios');

// retreives lobby and restores enemy HP if enemy HP is 0
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

// updates lobby enemy HP and restores enemy HP if enemy HP is 0
router.put("/:id", async (req, res) => {
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
        const lobbyCheck = await Lobby.findOne({ _id: req.params.id });
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
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
            res.send(lobby);
        } else if (decoded && req.body.enemyHP < lobbyCheck.enemyHP && req.headers.userkey === userkey.data.userkey) {
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
        function putUserkey() {
            return axios.put("https://api.userfront.com/v0/users/" + req.headers.userid, payload, options)
                .catch((err) => console.error(err));
        }
        await putUserkey();
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;