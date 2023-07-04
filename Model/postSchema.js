const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    content : { type : String , trim : true },
    postedby : { type : mongoose.Schema.Types.ObjectId , ref : 'User' },
    pinned : Boolean,
    likes : [{ type : mongoose.Schema.Types.ObjectId , ref : 'User' }],
    replyto : { type : mongoose.Schema.Types.ObjectId, ref : 'post' }
},{
  timestamps : true
});

let post = mongoose.model("post", postSchema);

module.exports = post;
