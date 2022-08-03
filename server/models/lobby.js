const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lobbySchema = new Schema({
  enemyHP: {
    type: Number,
  },
  maxHP: {
    type: Number,
  },
});

module.exports = mongoose.model("lobby", lobbySchema);
