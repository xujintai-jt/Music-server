
const mongoose = require("mongoose");

const userLikeModel = mongoose.Schema({
    mobile:{
        require:true,
        type:String,
    },
    userid:{
        require:true,
        type:String,
    },
    musicid: {
        require:true,
        type:String,
    },
    date: {
        require:true,
        type:String,
    }
})

module.exports = mongoose.model("userlikes", userLikeModel);