const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creatureSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imgPath: { 
        type: String,
    },
    hp: {
        type: Number,
    },
    attack: {
        type: Number,
    },
    speed: {
        type: Number,
    },
    defense: {
        type: Number,
    }
});

module.exports = mongoose.model("creature", creatureSchema);