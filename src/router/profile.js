const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth")
const { validateProfileData } = require("../utils/validate")
const bcrypt =require("bcrypt");


profileRouter.get("/profile", userAuth, async (req,res) => {
    try {
     const user = req.user;
     res.send(user)
 }   catch (error) {
         res.status(400).send("ERROR : " + error.message)
     }
 })

profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
   try { 
    if(!validateProfileData(req)) {
        throw new Error("Edit not allowed")
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((k) => loggedInUser[k] = req.body[k])
    await loggedInUser.save();
    res.json({msg: "Profile Updated successful"})
} catch (error) {
    res.status(400).send("ERROR : " + error.message)
}
})

profileRouter.patch("/profile/password", userAuth, async (req,res) => {
    try {
        const{ oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            throw new Error("Both old and new passwords are required");
        }
        const user = req.user;
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isMatch) {
            throw new Error("Incorrect password")
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({msg: "Password updated succesfully."})



    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }

})


 module.exports = {
    profileRouter
}

