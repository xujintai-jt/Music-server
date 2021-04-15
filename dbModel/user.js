/** 
*
*  @author: xujintai
*  @version: 1.0.0 
*  @description: 配置上机用户模型
*  @Date: 2020/10/17 10:45
*
*/ 

const mongoose = require("mongoose");

const userModel = mongoose.Schema({
    password:{
        require:true,
        type:String,
    },
    username:{
        require:true,
        type:String,
    },
    mobile: {
        require:true,
        type:String,
    },
    age: {
        require:true,
        type:String,
    },
    sex: {
        require:true,
        type:String,
    },
})

module.exports = mongoose.model("users", userModel);