const express = require('express');
const { connectDB } = require("./config/database")
const app = express();
const { User } = require("./models/user")

app.use(express.json());

app.post("/signup", async (req,res) => {
    const user = new User(req.body);

    try {
        await user.save();
    res.json("User created succesfully...");
    } catch (error) {
        res.status(400).send("something went wrong in user creation.")
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

connectDB()
.then(() => {
    console.log("database connected succesfully...");
    app.listen(7777, () => {
        console.log("Server is listening on port 7777");
    })
    
}).catch(() => {
    console.log("database connection failed!!!");
    
} )




