const Lobby = require("../models/Lobby");
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
        const restoredLobby = await Lobby.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            enemyHP: lobby.maxHP,
          }
        );
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

    if (verifiedUserkey && lobbyCheck.enemyHP <= 0) {
      let restoredLobby = await Lobby.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          enemyHP: lobbyCheck.maxHP,
        }
      );
      if (restoredLobby.victors.includes(decoded.userId)) {
        const newVictors = lobbyCheck.victors.filter(
          (victor) => victor !== decoded.userId
        );
        restoredLobby = await Lobby.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            victors: [newVictors[0]],
          }
        );
      }
      res.send(restoredLobby);
      generateUserkey(decoded.userId);
      return;
    }
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
    } else if (verifiedUserkey && req.body.victors !== undefined) {
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
    res.send(error);
  }
});

module.exports = router;
