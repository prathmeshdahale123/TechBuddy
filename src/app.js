const express = require('express');
const { connectDB } = require("./config/database")
const app = express();
const cookieParser = require("cookie-parser");
const { authRouter } = require('./router/auth');
const { profileRouter } = require('./router/profile');
const { requestRouter } = require('./router/request');
const { userRouter } = require('./router/user');


app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);




connectDB()
.then(() => {
    console.log("database connected succesfully...");
    app.listen(7777, () => {
        console.log("Server is listening on port 7777");
    })
    
}).catch(() => {
    console.log("database connection failed!!!");
    
} )




