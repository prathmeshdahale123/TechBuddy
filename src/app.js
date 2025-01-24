const express = require('express');

const app = express();

app.get("/test", (req,res) => {
    res.send("Namaste from dashboard!");
})

app.get("/home",(req,res) => {
    res.send("Hello Hello Hello ");
})

app.listen(7777, () => {
    console.log("Server is listening on port 7777");
})