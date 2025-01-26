const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20
    },
    lastName: {
        type: String,
        maxLength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxLength: 50
    },
    password: {
        type: String,
        required: true,
        minLength: 8 
    }, 
    age: {
        type: Number,
        min: 18
    }, 
    gender: {
        type: String,
        validate(value) {
            if(!["male","female","other"].includes(value))
                throw new Error("Gender not valid")
        }
    },
    about: {
        type: String,
        default: "this is default about of user"
    }, 
    skills: {
        type: [String]
    }
}, {
    timestamps: true
})

const User = mongoose.model("user", userSchema);

module.exports = {
    User
}