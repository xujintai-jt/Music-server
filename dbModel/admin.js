/** 
*
*  @author: xujintai
*  @version: 1.0.0 
*  @description: 管理员模型
*  @Date: 2020/10/16 11:05
*
*/ 

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const adminModel = mongoose.Schema({
    email:{
        require:true,
        type:String
    },
    username:{
        require:true,
        type:String
    },
    password:{
        require:true,
        type:String,
<<<<<<< HEAD
        set(val){
            return bcrypt.hashSync(val, 10)
        }
=======
        // set(val){
        //     return bcrypt.hashSync(val, 10)
        // }
>>>>>>> dev
    },
    identity:{
        // require:true,
        type:String
    },
    date:{
        require:true,
        type:String
    }
})

module.exports = mongoose.model("Admin", adminModel)