const express = require('express');

const app = express();
const { isAdminAuthorised, isUserAuthorized } = require("./middleware/auth")

app.use("/admin", isAdminAuthorised)

app.get("/user/data", isUserAuthorized, (req,res) => {
    res.send("user data send")
})
app.get("/user/login", (req,res) => {
    res.send("User logged in succesfully.")
})

app.get("/admin/getdata", (req,res) => {
    res.send("all data fetched");
})
app.get("/admin/delete", (req,res) => {
    res.send("user deleted succesfully");
})



app.listen(7777, () => {
    console.log("Server is listening on port 7777");
})