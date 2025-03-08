const express = require("express");
const { userAuth } = require("../middleware/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const userRouter = express.Router();

//API to get all the pending requests of loggedInUser
userRouter.get("/user/request/recieved",userAuth, async (req, res) => {
try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
        toUserId: loggedInUser._id,
        status:"interested"
    })
    res.json({
        msg:"Data fetched succesfully!",
        Data: connectionRequest
    })

} catch (error) {
    res.status(400).send("ERROR : " + error.message)
}
})

module.exports = {
    userRouter
}