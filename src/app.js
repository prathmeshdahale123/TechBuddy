const express = require('express');
const { connectDB } = require("./config/database")
const app = express();
const { User } = require("./models/user")
const { validateData } = require("./utils/validate")
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");


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
        const cookie = await jwt.sign({_id: user._id}, "pass123");
        
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

app.get("/profile", async (req,res) => {
   try {const cookies = req.cookies;
    const { Token } = cookies;
    if(!Token) {
        throw new Error("Invalid Token")
    }
    const decodedMsg = await jwt.verify(Token, "pass123")
    const { _id } = decodedMsg;
    const user = await User.findById({_id});
    if(!user) {
        throw new Error("User not found")
    }
    res.send(user)
}   catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})

//route to get user by email
app.get("/user", async (req,res) => {
    const userEmail = req.body.email;
    try {
        const user = await User.find({email: userEmail})
        if(user==0){
            res.send("User not found")
        } else{
            res.send(user);
        }
    } catch (error) {
        res.status(403).send("Something went wrong")
    }
})

//feed API - to get all users in db
app.get("/feed", async (req,res) => {
    try {
        const user = await User.find({})
        res.send(user)
    } catch (error) {
        res.status(403).send("Something went wrong")
    }
})

//delete a user by id
app.delete("/user", async (req,res) => {
    const userId = req.body.userId;
    try {
        //const user = await User.findByIdAndDelete({_id: userId})
        //shorthand of above -both are same
         const user = await User.findByIdAndDelete(userId)
        res.send("User deleted succesfully...")
        
    } catch (err) {
        res.status(400).send("something went wrong." + err.message)
        
    }
})

//API -update user information -by userId
app.patch("/user", async (req,res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const allowedUpdates = ["userId","about","firstName","age","password","skills","gender"];
        const isUpdateAllowed = Object.keys(data).every((k)=>
            allowedUpdates.includes(k)
        )
        
        if(!isUpdateAllowed) {
            throw new Error("Update not allowed")
        }

        if(data?.skills.length > 10) {
            throw new Error("more than 10 skills not allowed")
        }
        

    const user = await User.findByIdAndUpdate(userId, data, {
        runValidators: true
    });
    res.send("User updated succesfully")
    } catch (error) {
        res.status(400).send("something went wrong." + error.message)
    }
})

//update user by emailId
app.patch("/userEmail", async (req,res) => {
    const userEmail = req.body.email;
    const data = req.body;
    try {
        const user = await User.findOneAndUpdate({email: userEmail},data)
            res.send("User updated succesfully")
    } catch (error) {
        res.status(400).send("something went wrong." + error.message)
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




