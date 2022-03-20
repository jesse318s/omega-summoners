const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    userId: {
        type: Number,
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("connection", connectionSchema);