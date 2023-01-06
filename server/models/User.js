const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userfrontId: {
    type: Number,
  },
  name: {
    type: String,
  },
  avatarPath: {
    type: String,
  },
  experience: {
    type: Number,
  },
  drachmas: {
    type: Number,
  },
  creatureId: {
    type: Number,
  },
  displayCreatureStats: {
    type: Boolean,
  },
  relics: {
    type: Array,
  },
  chosenRelic: {
    type: Number,
  },
  preferredSpecial: {
    type: Number,
  },
});

module.exports = mongoose.model("User", userSchema);
