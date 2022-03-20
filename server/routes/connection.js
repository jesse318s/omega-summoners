const Connection = require("../models/connection");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require('axios');

const options = {
    headers: {
        Accept: "*/*",
        Authorization: `Bearer ${process.env.USERFRONT_KEY}`
    }
};

router.post("/", async (req, res) => {
    try {
        const payload = {
            data: {
                userkey: Math.random().toString(36).substring(7),
            }
        };
        function putUserkey() {
            return axios.put("https://api.userfront.com/v0/users/" + req.body.userId, payload, options)
                .catch((err) => console.error(err));
        }
        await putUserkey();
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
        const connection = await Connection.findOne({ userId: decoded.userId });
        const documentCount = await Connection.count({});
        if (!connection && decoded.userId === req.body.userId && documentCount < 3) {
            const connection = await new Connection(req.body).save();
            res.send(connection);
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
        const connection = await Connection.findOne({ userId: decoded.userId });
        res.send(connection);
        for await (const doc of Connection.find()) {
            // if createdAt is older than 2 minutes, delete the connection
            if (doc.createdAt < Date.now() - 100000) {
                await doc.remove();
            }
        }
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;