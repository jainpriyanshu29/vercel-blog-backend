const mongoose = require("mongoose")

const ContactSchema = new mongoose.Schema({
    name : String,
    email : String,
    phone_number : String,
    topic : String,
    message : String
});

const ContactModel = new mongoose.model("Contact" , ContactSchema)

module.exports = ContactModel;