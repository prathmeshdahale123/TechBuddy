const validator = require("validator");

const validateData = (req) => {
    const { firstName, lastName, email, password } = req.body;
    
    if(!(firstName && lastName)) {
        throw new Error("name not valid") 
    } else if(!validator.isEmail(email)){
        throw new Error("email not valid") 
    } else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password") 
    }
}

const validateProfileData = (req) => {
    const allowedEdits = ["firstName", "lastName", "age", "gender", "skills", "about"];
    const isEditAllowed = Object.keys(req.body).every((k) => 
        allowedEdits.includes(k)
    )
    return isEditAllowed;
}

module.exports = {
    validateData,
    validateProfileData
}