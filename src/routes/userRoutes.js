const express = require('express');
const bcryptNode = require('bcrypt-nodejs');
const userRouter = express.Router();
const userSchema = require("../models/user");

userRouter.post("/authenticate", function(req, res) {
    userSchema.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            console.log(err);
            return res.json({"success": false, "message": "Error validating the user"});
        } else {
            if(!user) {
                console.log("user not found");
                return res.json({"success": false, "message": "User not found"});
            } else {
                //User found
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

module.exports = userRouter;