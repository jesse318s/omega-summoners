const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creatureSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    imgPath: { 
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("creature", creatureSchema);