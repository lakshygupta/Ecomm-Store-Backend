var express = require('express')
var router = express.Router()
const {signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check, validationResult } = require('express-validator');

//router.post/get/put/delete("/route of url", [express validation backend], "controller");
//restriction on routes -> isSignedn, isAuthenticates, isAdmin, isSemiAdmin ====> vdo:7.6
/*Some type of routes ->
        1. The Route that want user can see without even login in teh application
        2. The routes that can see by the user only after he logged in the application
        3. The authenticate route ie. the changes that user can make only in his own account */ 

router.post("/signup",[
    check("name").isLength({min:3}).withMessage("name should be atleast 3 character"),
    check("email").isEmail().withMessage("email is required"),
    check("password").isLength({min:3}).withMessage("password should be atleast 3 character"),
] ,signup);

router.post("/signin",[
    check("email").isEmail().withMessage("email is required"),
    check("password").isLength({min:1}).withMessage("password is required"),
] ,signin);

router.get("/signout",signout);

router.get("/testroute",isSignedIn, (req,res) => {
    // res.send("A Protected Route");
    res.json(req.auth);
})
module.exports = router;