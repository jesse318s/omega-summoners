const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  itemId: {
    type: Number,
  },
  type: {
    type: String,
  },
  itemQuantity: {
    type: Number,
  },
  userId: {
    type: Number,
  },
});

module.exports = mongoose.model("Item", itemSchema);
