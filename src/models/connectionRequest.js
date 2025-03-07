const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: '{VALUE} is not supported'
        }
    }
}, {
    timestamps: true
})

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You can not send request to yourself!")
    }
    next();
})

const ConnectionRequestModel = mongoose.model("ConnectionRequestModel", connectionRequestSchema)

module.exports = {
    ConnectionRequestModel
}