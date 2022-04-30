const User = require("../models/user");
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken'); // seting the token in the broswer for login and to resrict the routes to work only on authenticate
var expressJwt = require('express-jwt'); // to check if the user is authenticate or not or the token is set or not

exports.signup = (req,res) => {

    //validation result checking from routes/auth.js
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(422).json({
            error: errors.array()[0].msg,
            param: errors.array()[0].param
        });
    }

    //controlling the route signup
    const user = new User(req.body);
    user.save((err,user) => {
        if(err){
            console.log(err);
            return res.status(400).json({
                err: "NOT ABLE TO SAVE USER IN DB"
            });
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
};

exports.signin = (req,res) => {

    const errors = validationResult(req);
    const  {email,password} = req.body; //destructuring -> requesting email and password from the body

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
 
    User.findOne({email}, (err,user) => {
        if(err || !user){
            return  res.status(400).json({
                error:"User email doesnt exist"
            });
        }
        if(user===null || !user.autheticate(password)){ //user is form the abovve findOne
            return res.status(401).json({
                error:"Email and Password didnt match"
            })
        } 

        //now if all the cases passed ie->  email password matches than we need the user to signin
        // now for sign in we need to first create and set the token in the cookie of the browser
        //create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET);

        //put token in cookie
        res.cookie("token",token,{expire: new Date() +9999});

        //send response to frontend
        //now we need to do deconstruction because we dont want to send the complete user to the frontend
        const {_id,name,email,role,address,pincode} = user;
        return res.json({token, user: {_id,name,email,role,address,pincode} });
    })
}

exports.signout = (req,res) => {
    // res.send("User Signout success");

    //we just need to clear the cookie to signout the user that we have set at the time of login
    res.clearCookie("token");
    res.json({
        message : "User Signout Successfully!!" //from controller
    });
}

//protected routes
exports.isSignedIn = expressJwt({ //also a middleware but from express
    secret: process.env.SECRET,
    userProperty: "auth"
});

//custom middlewares
exports.isAuthenticated = (req,res,next) => { //since its a middleware so next is used
//to edit the details of user by the user => 
//req.profile-> set by frontend
//req.auth-> send by isSignedIn
//req.profile._id === req.auth._id -> to check if the 
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "Access Denied",     
        });
    }
    next();
} 

exports.isAdmin = (req,res,next) => { //since its a middleware so next is used
    //we use role form models/user.js if role=0 then its user if role=1 its admin
    if(req.profile.role === 0){
        return res.status(403).json({
            error : "You are not admin, Access Denied",
        });
    }
    next();
} 