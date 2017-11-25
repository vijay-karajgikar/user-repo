const express = require('express');
const bcryptNode = require('bcrypt-nodejs');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const userSchema = require("../models/user");
const config = require('../config');

userRouter.post("/authenticate", function(req, res) {
    userSchema.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            console.log(err);
            return res.json({"success": false, "message": "Authentication failed. Error while getting the user details"});
        } else {
            if(!user) {
                console.log("user not found");
                return res.json({"success": false, "message": "Authentication failed. User not found"});
            } else if (user) {
                //User found

                bcryptNode.compare(req.body.password, user.password, (err, hashMatch) => {
                    if(err) {
                        console.log("Error creating the hash for the password");
                        return res.json({"success": false, "message": "Error generating the hash for the password"});
                    } else {
                        const payload = { email: req.body.email };
                        var token = jwt.sign(payload, config.tokensecret, {
                            expiresIn: 60*60*24
                        });
        
                        return res.json({
                            "success": true,
                            "message": "Authentication succeeded.",
                            token: token
                        });
                    }
                });
            }
        }
    });
});

userRouter.post("/register", (req, res) => {
    //First find the user based on the email address.
    //If exists send the response indicating that the user already exists
    //else create the user.
    userSchema.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            console.log("Error finding the user with email");
            console.log(err);
            return res.json({"success": false, "message": "Error validating the user"});
        } else {
            if(user) {
                console.log("user exists");
                return res.json({"success": false, "message": "User already exists"});
            } else {
                const newUser = new userSchema();
                newUser.email = req.body.email;
                newUser.name = req.body.name;
                newUser.location = req.body.location;
                bcryptNode.hash(req.body.password, null, null, (err, hash) => {
                    if(err) {
                        console.log("Error creating the hash for the password");
                        return res.json({"success": false, "message": "Error generating the hash for the password"});
                    } else {
                        newUser.password = hash;
                    }
                });
                userSchema.create(newUser, (err, newUser) => {
                    if(err) {
                        console.log(err);
                        return res.json({"success": false, "message": "Error creating a new user"});
                    } else {
                        console.log("User created");
                        return res.json({"success": true, "message": "User registered successfully"});
                    }
                });

            }
        }
    });
});



//All the routes below this should be protected.
userRouter.use((req, res, next) => {
    var token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(token) {

        jwt.verify(token, config.tokensecret, (err, decoded) => {
            if(err) {
                console.log(err);
                return res.json({
                    "success": false,
                    "message": "Failed to authenticate, invalid token"
                })
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else {

        return res.status(403).send({
            "success": false, 
            "message": "Failed to authenticate, invalid token"
        });
    }

});

userRouter.post('/details', (req, res) => {
    userSchema.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            console.log("Error finding the user");
            console.log(err);
            return res.json({
                "success": false, "message": "error getting the user details"
            });
        } else {
            return res.json(user);
        }
    });
});




module.exports = userRouter;