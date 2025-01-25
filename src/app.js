const express = require('express');

const app = express();

app.use("/user", (req, res, next) => {
    next();
    
}, (req, res, next) => {
    next();
    
}, (req, res, next) => {
    res.send("response 3");
    next();
}
) 

app.listen(7777, () => {
    console.log("Server is listening on port 7777");
})