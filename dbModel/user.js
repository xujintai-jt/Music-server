/** 
*
*  @author: xujintai
*  @version: 1.0.0 
*  @description: 配置上机用户模型
*  @Date: 2020/10/17 10:45
*
*/ 
<<<<<<< HEAD
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userModel = mongoose.Schema({
    order_id:{
        require:true,
        type:String
    },
    startTime:{
        require:true,
        type:String
    },
    endTime:{
        require:true,
        type:String
    },
    money:{
        require:true,
        type:String
    },
    account:{
        require:true,
        type:String
    },
    password:{
        require:true,
        type:String,
        set(val){
            return bcrypt.hashSync(val, 10)
        }
    },
    publicpwd:{  // 明文, 防止忘记密码
        require:true,
        type:String
    }
=======

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
>>>>>>> dev
})

module.exports = mongoose.model("users", userModel);