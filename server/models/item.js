const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    itemId: {
        type: Number,
    },
    itemQuantity: {
        type: Number,
    },
    userId: {
        type: Number,
    }
});

module.exports = mongoose.model("item", itemSchema);