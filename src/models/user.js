const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:           {type: String, require: true},
    email:          {type: String, require: true, unique: true},
    password:       {type: String, required: true},
    admin:          {type: Boolean},
    location:       {type: String},
    meta:           { age: Number, website: String },
    created_date:   { type: Date, default: Date.now },
    updated_date:   { type: Date }
});

const User = module.exports = mongoose.model("User", userSchema);
