const express = require('express');
const { connectDB } = require("./config/database")
const app = express();
const { User } = require("./models/user")

app.use(express.json());

//API route to create new user
app.post("/signup", async (req,res) => {
    const user = new User(req.body);

    try {
        await user.save();
    res.json("User created succesfully...");
    } catch (error) {
        res.status(400).send("something went wrong in user creation." + error.message)
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




