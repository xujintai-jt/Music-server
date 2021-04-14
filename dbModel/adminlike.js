/** 
*
*  @author: huangkairan
*  @version: 1.0.0 
*  @description: ktv推荐歌曲,管理员操作
*  @Date: 2020/10/18 10:37
*
*/ 
const mongoose = require("mongoose");

const adminLikeModel = mongoose.Schema({
    s_id:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model("AdminLike", adminLikeModel);