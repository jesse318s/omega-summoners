const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const potionTimerSchema = new Schema({
    userId: {
        type: Number,
    },
    potionId: {
        type: Number,
    },
    potionDuration: {
        type: Number,
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("potionTimer", potionTimerSchema);