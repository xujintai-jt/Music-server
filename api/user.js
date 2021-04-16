
/**
 *
 *  @author: xujintai
 *  @version: 1.0.0
 *  @description: 用户登录, 听歌操作
 *  @Date: 2020/10/13 22:59
 *
 */


const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");


const Remarks = require("../dbModel/remark");
const Users = require("../dbModel/user");
const jwt_key = require("../secret/jwtkey").KEYORSECRET;
const isBadAccount = require("../config/isBadAccount");

const Music = require("../dbModel/music");
const AdminLike = require("../dbModel/adminlike");


// 测试创建文件夹
// router.post("/add", (req, res) => {
//     const user = req.body.username;
//     fs.mkdir(path.resolve(__dirname, "../static/avatar/" + user), (error) => {
//         if(error){  // 如果存在
//             console.log("已存在");
//             res.send("已存在");
//             return;
//         }else{
//             res.send("创建成功");
//         }
//     })
// })
// 用户注册
router.post("/register", async (req, res) => {
  const { body } = req;
  Users.find({ mobile: body.mobile }, (err, docs) => {
    if (err) {
      console.log("查询注册信息失败");
    } else if (docs.length === 0) {
      Users.create(body, (err, docs) => {
        if (err) {
          res.end(err);
          console.log("数据插入失败");
          return;
        }
        console.log("数据插入成功");
        res.end("恭喜您，用户注册成功！");
      });
    } else {
      res.writeHead(201, { "Content-Type": "text/html; charset=utf-8" });
      res.end("该用户已注册!");
    }
  });
});

// 用户登录
router.post("/login", async (req, res) => {
  const { body } = req;
  const { password, mobile } = body;
  Users.find({ mobile }, (err, docs) => {
    if (err) {
      console.log("查询注册信息失败");
    } else if (docs.length === 0) {
      res.writeHead(201, { "Content-Type": "text/html; charset=utf-8" });
      res.end("该手机号未注册!");
    } else {
      Users.find({ mobile, password }, (err, docs) => {
        if (err) {
          console.log("查询注册信息失败");
        } else if (docs.length === 0) {
          res.writeHead(201, { "Content-Type": "text/html; charset=utf-8" });
          res.end("密码错误");
        } else {
          res.end("登陆成功");
        }
      });
    }
  });
});

//用户编辑
router.post("/edit", async (req, res) => {
  const { mobile } = req.body;
  const nowUser = {};
  nowUser.username = req.body.username;
  nowUser.mobile = req.body.mobile;
  nowUser.sex = req.body.sex;
  nowUser.age = req.body.age;
  nowUser.password = req.body.password;
  await Users.findOneAndUpdate(
    { mobile },
    { $set: nowUser },
    { new: true }
  ).then((nowUser) => {
    nowUser
      .save()
      .then(() => {
        console.log("用户信息更新成功");
        res.status(200).json({ status: "200", result: "用户信息更新成功" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ status: "500", result: "更新失败,未知错误" });
      });
  });
});

//用户添加评论信息
router.post("/remark", async (req, res) => {
  console.log(11);
  const { body } = req;
  Remarks.create(body, (err, docs) => {
    if (err) {
      res.end(err);
      console.log("发表评论失败！");
      return;
    }
    console.log("发表评论成功！");
    res.end("发表评论成功！");
  });
});



//查询用户信息
router.get("/query", async (req, res) => {
  const { mobile } = req.query;
  Users.findOne({ mobile }, (err, docs) => {
    if (err) {
      console.log("查询用户信息失败");
    } else if (docs.length === 0) {
      res.send("该手机号未注册！");
    } else {
      res.send(docs);
    }
  });
});

// 测试  isBadAccount(params)方法
router.post(
  "/test",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // console.log(req.user)
    if (await isBadAccount(req.user)) {
      // do something
      res.send("OK");
    } else {
      res.status(401).json({ status: "401", result: "帐号过期,请联系管理员" });
    }
  }
);


module.exports = router;
