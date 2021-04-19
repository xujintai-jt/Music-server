
/**
 *
 *  @author: xujintai
 *  @version: 1.0.0
 *  @description: 展示歌曲,播放列表,搜索歌曲
 *  @Date: 2020/10/13 23:01
 *
 */


const express = require("express");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const Music = require("../dbModel/music");
const AdminLike = require("../dbModel/adminlike");
const UserLike = require("../dbModel/userlike");
const isBadAccount = require("../config/isBadAccount");


// 获取所有歌曲(需要authenticate)
// router.get("/all", passport.authenticate("jwt", {session:false}), async(req, res) => {
//     await Music.find()
//             .then(musics => {
//                 musics.length ? res.send(musics) : res.json({status:200, result:"音乐为空"})
//             })
// })

// 获取所有音乐信息
router.get("/all", async (req, res) => {
  await Music
    .find()
    .collation({"locale": "zh", numericOrdering:true})
    .sort({playcount:-1})
    .then((musics) => {
      console.log(musics);
    musics.length
      ? res.send(musics)
      : res.json({ status: 200, result: "音乐为空" });
  });
});

// 通过歌曲id获取歌曲信息
router.get("/queryid", async (req, res) => {
  const {id} =req.query
  await Music.find({ _id:id })
    .then((musics) => {
    musics.length
      ? res.status(200).send({ status: 200, result: musics })
      : res.status(201).send({ status: 201, result: "音乐为空" });
    })
    .catch((err) => {
      res.send({ status: 500, result: err });
    });
});

// 通过歌曲id获取歌曲文件
router.get("/nowmusic", async (req, res) => {
  const _id = req.query.id;
  await Music.findOne({ _id })
    .then((music) => {
      if (music) {
        res.sendFile(path.resolve(__dirname, "../static/music/" + music.src));
        const sum = parseInt(music.playcount) + 1;
        const count = {
          playcount: sum,
        };
        Music.findOneAndUpdate(
          { _id: _id },
          { $set: count },
          { new: true }
        ).then((newCount) => {
          newCount.save().then(() => {
            // console.log("播放成功");
          });
        });
      } else {
        res.sendFile(path.resolve(__dirname, "../static/view/404.html"));
      }
    })
    .catch(() => {
      res.sendFile(path.resolve(__dirname, "../static/view/404.html"));
    });
});

// 获取歌曲海报
router.get("/poster", (req, res) => {
  const exists = fs.existsSync(
    path.resolve(__dirname, "../static/poster/" + req.query.song)
  );
  // console.log(exists)
  res.sendFile(path.resolve(__dirname, "../static/poster/" + req.query.img));
});

// 通过songName搜索歌曲
router.post(
  "/search/byname",
  //   passport.authenticate("jwt", { session: false }), //验证信息
  async (req, res) => {
    const songName = req.body.searchName.trim();
    await Music.find({ songName: { $regex: songName, $options: "i" } }).then(
      (songs) => {
        if (songs.length) {
          res.send(songs);
        } else {
          Music.find({ artist: { $regex: songName, $options: "i" } }).then(
            (artists) => {
              res.send(artists);
            }
          );
        }
      }
    );
  }
);


// user操作
// 用户添加收藏音乐
router.post("/userlike", async (req, res) => {
  const { body } = req;
  const { musicid, mobile } = body;
  //判断用户是否已添加收藏
  await UserLike.find({ mobile, musicid })
    .then((docs) => {
      if (docs.length === 0) {
        UserLike.create(body, (err, docs) => {
          if (err) {
            res.send(err);
            console.log("用户音乐收藏数据插入失败");
            return;
          } else {
            console.log("用户音乐收藏数据插入成功");
            res.status(200).json({
              status: "200",
              result: "收藏音乐成功,请进入音乐收藏界面查看!",
            });
          }
        });
      } else {
        res
          .status(203)
          .json({ status: "203", result: "音乐已收藏，请勿重复添加收藏!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

// 获取指定用户收藏音乐
router.get("/userlike", async (req, res) => {
  const { userid } = req.query;
  //判断用户是否已添加收藏
  await UserLike
    .find({ userid })
    .then((docs) => {
    const userlikes = [];
    //docs：此用户所有的音乐收藏数
    docs.forEach(async (item, index) => {
      //将每一项的musicid取出，进入音乐表中通过musicid找到此music的完整信息
      const { musicid } = item;
      await Music
        .findOne({ _id: musicid })
        .then((doc) => {
          //将筛选出的音乐信息对象保存进数组
          if (doc) {
            userlikes.push(doc);
          }
          if (userlikes.length === docs.length) {
            console.log("返回音乐收藏信息成功");
            res.status(200).json({
              status: "200",
              result: userlikes,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            status: "500",
            result: err,
          });
          // res.send(err)
        });
    });
  });
  //第一个then结束
});

// 获取所有用户收藏音乐
router.get("/alluserlike", async (req, res) => {
  await UserLike
    .find()
    .then((docs) => {
      console.log("获取所有用户收藏音乐数据成功");
      res.status(200).send({status:200,result:docs})
    })
    .catch((err) => {
      res.status(500).send({status:500,result:err})
    });
});


//用户移除收藏音乐
// 删除歌曲
router.post(
  "/userlike/del",
  async (req, res) => {
    const { musicid,userid } = req.body;
    await UserLike.findOneAndRemove({ musicid,userid }, (err, doc) => {
      if (!err) {
      return  res.status(200).json({ status: 200, result: "该收藏音乐移除成功" });
      }
      res.status(500).json({ status: 500, result: "该收藏音乐移除失败" });
    });
  })


// user操作
router.post(
  "/hot",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (await isBadAccount(req.user)) {
      Music.find().then((musics) => {
        const musicList = musics;
        for (var i = 0; i < musicList.length - 1; i++) {
          for (var j = 0; j < musicList.length - 1 - i; j++) {
            if (
              parseInt(musicList[j].playcount) <
              parseInt(musicList[j + 1].playcount)
            ) {
              var temp = musicList[j];
              musicList[j] = musicList[j + 1];
              musicList[j + 1] = temp;
            }
          }
        }
        res.send(musicList);
      });
    } else {
      res.status(401).json({ status: "401", result: "帐号过期,请联系管理员" });
    }
  }
);

// 获取所有admin收藏歌曲
router.post(
  "/user/adminlike",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (await isBadAccount(req.user)) {
      Music.find().then((allsongs) => {
        AdminLike.find().then((adminlikes) => {
          var result = [];
          allsongs.forEach((item) => {
            adminlikes.forEach((al) => {
              if (item._id == al.s_id) {
                result.push(item);
              }
            });
          });
          res.send(result);
        });
      });
    } else {
      res.status(401).json({ status: "401", result: "帐号过期,请联系管理员" });
    }
  }
);

// 语种点歌
router.post(
  "/language",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (await isBadAccount(req.user)) {
      const language = req.body.language;
      Music.find({ language }).then((musics) => {
        res.send(musics);
      });
    } else {
      res.status(401).json({ status: "401", result: "帐号过期,请联系管理员" });
    }
  }
);

// 风格点歌
// router.post(
//   "/style",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     if (await isBadAccount(req.user)) {
//       const style = req.body.style;
//       Music.find({ style }).then((musics) => {
//         res.send(musics);
//       });
//     } else {
//       res.status(401).json({ status: "401", result: "帐号过期,请联系管理员" });
//     }
//   }
// );

// 风格点歌
router.post("/style",async (req, res) => {
  const { style } = req.body;
      Music.find({ style }).then((musics) => {
        res.send(musics);
      }).catch((err) => {
        console.log(err);
        res.send(err);
      })
  
  }
);

// 明星点歌
router.post(
  "/artist",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (await isBadAccount(req.user)) {
      const artist = req.body.artist;
      Music.find({ artist }).then((musics) => {
        res.send(musics);
      });
    } else {
      res.status(401).json({ status: "401", result: "帐号过期,请联系管理员" });
    }
  }
);

// 搜索歌曲
router.post(
  "/search",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (await isBadAccount(req.user)) {
      const songName = req.body.searchName.trim();
      Music.find({ songName: { $regex: songName, $options: "i" } }).then(
        (songs) => {
          if (songs.length) {
            res.send(songs);
          } else {
            Music.find({ artist: { $regex: songName, $options: "i" } }).then(
              (artists) => {
                res.send(artists);
              }
            );
          }
        }
      );
    } else {
      res.status(401).json({ status: "401", result: "帐号过期,请联系管理员" });
    }
  }
);

// 用户获取所有歌曲
router.post(
  "/all",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (await isBadAccount(req.user)) {
      Music.find().then((musics) => {
        res.send(musics);
      });
    } else {
      res.status(401).json({ status: "401", result: "帐号过期,请联系管理员" });
    }
  }
);

module.exports = router;

