const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userfrontId: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
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
        type: String,
    },
    displayCreatureStats: {
        type: Boolean,
    }
});

module.exports = mongoose.model("user", userSchema);