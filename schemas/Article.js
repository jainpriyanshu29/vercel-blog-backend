const mongoose = require("mongoose")

const ArticleSchema = new mongoose.Schema({
    email:String,
    author : String,
    title : String,
    article : String,
    articleimage : String,
    postdate: {
        type : Date , default : Date.now
    }
});

const ArticleModel = new mongoose.model("Article" , ArticleSchema)

module.exports = ArticleModel;