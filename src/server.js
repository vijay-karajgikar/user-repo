const express = require('express');
const port = process.env.port || 8789;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRouter = require('./routes/userRoutes');
const config = require('./config');

mongoose.connect(config.db, {
    useMongoClient: true, promiseLibrary: global.Promise
});
var userDb = mongoose.connection;
userDb.on("error", (err) => {
    console.log("Could not connect to the mongo DB at mLab.");
    console.log(err);
});

userDb.once("open", () => {    
    console.log("Connected to Mongo DB at mLab - users");
    const app = express();
    app.use(bodyParser.json());
    app.use("/user", userRouter);
    app.set("jsonwebtoken", config.tokensecret);
    app.listen(port, (err) => {
        console.log("User Repo Lib APIs available at http://localhost:" + port);
    });
});

