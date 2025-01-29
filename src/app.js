const express = require('express');
const { connectDB } = require("./config/database")
const app = express();
const { User } = require("./models/user")
const { validateData } = require("./utils/validate")
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth")


app.use(express.json());
app.use(cookieParser());

//API route to create new user
app.post("/signup", async (req,res) => {
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
    res.json("User created succesfully...");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})

//login API
app.post("/login", async (req,res) => {
    try {
        const { email, password } = req.body;
    if(!validator.isEmail(email)){
        throw new Error("Invalide email format")
    }
    const user = await User.findOne({email})
    if(!user) {
        throw new Error("email not present")
    } 
   const isPassValid = await bcrypt.compare(password, user.password)
   if(isPassValid) {
        const cookie = await jwt.sign({_id: user._id}, "pass123", {
            expiresIn: "7d"
        });
        
        res.cookie("Token", cookie)
        res.send("Login succesfull")
   }
   else{
        throw new Error("Invalid password")
   }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})

app.get("/profile", userAuth, async (req,res) => {
   try {
    const user = req.user;
    res.send(user)
}   catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})

app.post("/sendConnectionRequest", userAuth, async (req,res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent a connection request!!!")
} catch (error) {
    res.status(400).send("ERROR : " + error.message)
}
})

connectDB()
.then(() => {
    console.log("database connected succesfully...");
    app.listen(7777, () => {
        console.log("Server is listening on port 7777");
    })
    
}).catch(() => {
    console.log("database connection failed!!!");
    
} )




