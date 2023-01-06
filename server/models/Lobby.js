const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lobbySchema = new Schema({
  enemyHP: {
    type: Number,
  },
  maxHP: {
    type: Number,
  },
  victors: {
    type: Array,
  },
});

module.exports = mongoose.model("Lobby", lobbySchema);
