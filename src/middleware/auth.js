const isAdminAuthorised = (req,res,next) => {
    console.log("admin authorization getting checked.");
    
    const token = "xyz";
    const isAdminAuthrised = token == "xyz";
    if(!isAdminAuthrised) {
        res.status(403).send("Unauthorised request!!!")
    } else {
        next();
    }
}

const isUserAuthorized = (req,res,next) => {
    console.log("User authorization getting checked.");
    
    const token = "xyz";
    const isAdminAuthrised = token == "xyz";
    if(!isAdminAuthrised) {
        res.status(403).send("Unauthorised request!!!")
    } else {
        next();
    }
}

module.exports = {
    isAdminAuthorised,
    isUserAuthorized
}