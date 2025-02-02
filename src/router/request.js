const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth")
const { ConnectionRequestModel } = require("../models/connectionRequest")
const { User } = require("../models/user")


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)) {
            throw new Error("Invalid request")
        }
        const existingRequest = await ConnectionRequestModel.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })
        if(existingRequest) {
            throw new Error("Request already exists")
        }
        const toUser = await User.findById(toUserId)
        if(!toUser) {
            throw new Error("user does not exist in db!!")
        }

        const connectionRequest = await new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save();

        res.json({message:"connection request sent succesfully!", data})

  } catch (error) {
      res.status(400).send("ERROR : " + error.message)
  }
  })
  

  module.exports = {
    requestRouter
}
