const mongoose = require("mongoose")

const connectDB = async () => {

    mongoose.connect("mongodb+srv://hellopriyanshu2003:I2MsnRFdy7ABtr9B@cluster0.ngovn0z.mongodb.net/blogging").then(() => {
        console.log("connected")
    }).catch((err) => {
        console.log("err", err)
    })

}

module.exports = connectDB;