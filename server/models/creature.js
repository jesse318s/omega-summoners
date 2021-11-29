const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creatureSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imgPath: { 
        type: String,
    }
});

module.exports = mongoose.model("creature", creatureSchema);