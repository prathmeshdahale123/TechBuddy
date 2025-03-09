const express = require("express");
const { userAuth } = require("../middleware/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age gender skills"

//API to get all the pending requests of loggedInUser
userRouter.get("/user/request/recieved",userAuth, async (req, res) => {
try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
        toUserId: loggedInUser._id,
        status:"interested"
    }).populate("fromUserId", USER_SAFE_DATA)
    res.json({
        msg:"Data fetched succesfully!",
        Data: connectionRequest
    })

} catch (error) {
    res.status(400).send("ERROR : " + error.message)
}
})

userRouter.get("/user/connections", userAuth, async(req,res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                {toUserId: loggedInUser._id, status:"accepted"},
                {fromUserId: loggedInUser._id, status:"accepted"}
            ]   
        })
        .populate("fromUserId", USER_SAFE_DATA )
        .populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId; // If the logged-in user is the sender, return the receiver
            } else {
                return row.fromUserId; // Otherwise, return the sender
            }
             
        }
           
        )
        res.json({ data })

    } catch (error) {
       res.status(400).send("ERROR " + error.message) 
    }
})

module.exports = {
    userRouter
}