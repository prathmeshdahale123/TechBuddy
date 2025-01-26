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

connectDB()
.then(() => {
    console.log("database connected succesfully...");
    app.listen(7777, () => {
        console.log("Server is listening on port 7777");
    })
    
}).catch(() => {
    console.log("database connection failed!!!");
    
} )




