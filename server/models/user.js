const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userfrontId: {
        type: Number,
    },
    name: {
        type: String,
    },
    avatar: {
        type: String,
    },
    experience: {
        type: Number,
    },
    creature: {
        type: Schema.Types.ObjectId,
    }
});

module.exports = mongoose.model("user", userSchema);