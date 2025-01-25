const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://prathmeshdahale2023:Whyask%40123@cluster0.ln7ix.mongodb.net/TechBuddy");
}

 
module.exports = {
    connectDB
}