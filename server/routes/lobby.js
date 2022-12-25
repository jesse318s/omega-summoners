const Lobby = require("../models/lobby");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  verifyUserkey,
  generateUserkey,
  generateFortifiedUserkey,
} = require("../libs/userkeyGeneratorAndVerifier.js");

// retrieves lobby and restores enemy HP if enemy is dead
router.get("/:id", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

    if (decoded) {
      const lobby = await Lobby.findOne({ _id: req.params.id });
      if (lobby.enemyHP <= 0) {
        await Lobby.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            enemyHP: lobby.maxHP,
          }
        );
        const restoredLobby = await Lobby.findOne({ _id: req.params.id });
        res.send(restoredLobby);
      } else {
        res.send(lobby);
      }
    }
  } catch (error) {
    res.send(error);
  }
});

// updates lobby enemy HP/victors
router.put("/:id", async (req, res) => {
  try {
    const lobbyCheck = await Lobby.findOne({ _id: req.params.id });
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    const verifiedUserkey = await verifyUserkey(decoded, req.headers.userkey);

    if (verifiedUserkey && req.body.enemyHP < lobbyCheck.enemyHP) {
      if (req.body.victors !== undefined) {
        const lobby = await Lobby.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            enemyHP: req.body.enemyHP,
            victors: req.body.victors,
          }
        );
        res.send(lobby);
      } else {
        const lobby = await Lobby.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            enemyHP: req.body.enemyHP,
          }
        );
        res.send(lobby);
      }
      generateUserkey(decoded.userId);
    } else if (req.body.victors !== undefined && verifiedUserkey) {
      const lobby = await Lobby.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          victors: req.body.victors,
        }
      );
      res.send(lobby);
      generateUserkey(decoded.userId);
    } else {
      res.send("Unauthorized");
      generateFortifiedUserkey(decoded.userId);
    }
  } catch (error) {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

    res.send(error);
    generateFortifiedUserkey(decoded.userId);
  }
});

module.exports = router;
