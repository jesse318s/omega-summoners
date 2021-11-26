const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userfrontId: {
        type: Number,
    },
    name: {
        type: String,
    },
    img_path: { 
        type: String,
    }
});

module.exports = mongoose.model("user", userSchema);