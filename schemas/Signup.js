const mongoose = require("mongoose")

const SignupSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    phone_number : String,
    topic : String,
    image : String
});

const SignupModel = new mongoose.model("Signup" , SignupSchema)

module.exports = SignupModel;