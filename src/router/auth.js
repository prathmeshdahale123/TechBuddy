const express = require("express");
const authRouter = express.Router();
const { User } = require("../models/user")
const bcrypt = require("bcrypt");
const validator = require("validator");
const { validateData } = require("../utils/validate")


//API route to create new user
authRouter.post("/signup", async (req,res) => {
    try {
    //validate data
    validateData(req)

    // encrypt the password
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
   
    const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });
    
        await user.save();
    res.json({msg: "User created succesfully..."});
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})

//login API
authRouter.post("/login", async (req,res) => {
    try {
        const { email, password } = req.body;
        
    if(!validator.isEmail(email)){
        throw new Error("Invalide email format")
    }
    const user = await User.findOne({email})
    if(!user) {
        throw new Error("User not found")
    } 
   const isPassValid = await user.validatePassword(password)
   if(!isPassValid) {
        throw new Error("Invalid password")
   } 
   const token = await user.setJWT();
        res.cookie("Token", token)
        res.send("Login succesfull")
   
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})

authRouter.post("/logout", async (req,res) => {
    res.cookie("Token", null, {
        expires: new Date(Date.now())
    })
    res.json({msg:'User Logged out succesfully'})
})

module.exports = {
    authRouter
}

