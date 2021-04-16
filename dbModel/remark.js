const mongoose = require("mongoose");

const musicRemarksModel = mongoose.Schema({
  musicid: {
    require: true,
    type: String,
  },
  remarks: {
    require: true,
    type: String,
  },
  counts: {
    require: true,
    type: String,
  },
  username: {
    require: true,
    type: String,
  },
  mobile: {
    require: true,
    type: String,
  },
  date: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("remarks", musicRemarksModel);
