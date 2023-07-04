const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fistname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  profilepic: { type: String, default: "images/profilepic.jpeg" },
  likes : [{ type : mongoose.Schema.Types.ObjectId , ref : 'post' }]
},{
  timestamps : true
});

let User = mongoose.model("User", userSchema);

module.exports = User;
