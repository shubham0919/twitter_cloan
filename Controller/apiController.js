const Post = require('../Model/postSchema')
const User = require('../Model/userSchema')

module.exports.get = async (req,res) => {
    let get = await Post.find().populate('postedby').populate('replyto').sort({'createdAt':-1})
    if(!get) {
        console.log(error);
        res.sendStatus(400)
    }
    get = await User.populate(get,{ path : 'replyto.postedby' })
    res.status(200).send(get)
}


module.exports.getreply = async (req,res) => {
    let postId = req.params.id
    let data = {_id : postId}
    let get = await Post.find(data).populate('postedby').populate('replyto').sort({'createdAt':-1})
    if(!get) {
        console.log(error);
        res.sendStatus(400)
    }
    get = get[0]

    get = await User.populate(get,{ path : 'replyto.postedby' })
    res.status(200).send(get)
    
}

module.exports.post = async (req,res) => {



    if (!req.body.content) {
        console.log('Content param not send with reqest');
        return res.sendStatus(400);
    }

    let postData = {
        content : req.body.content,
        postedby : req.session.user
    }

    if(req.body.replyto){
        postData.replyto = req.body.replyto
    }

    let twitting = await Post.create(postData)
    if(!twitting) {
        console.log(error);
        res.sendStatus(400)
    }
    await User.populate(twitting, { path : 'postedby' })
    res.status(201).send(twitting)
}

module.exports.put = async (req,res) => {

    let postId = req.params.id
    let userId = req.session.user._id

    let isLiked = req.session.user.likes && req.session.user.likes.includes(postId)
    let option = isLiked ? '$pull' : '$addToSet';

    console.log('Is Liked:' + isLiked);
    console.log('Option:' + option);
    console.log('UserId:' + userId);

    req.session.user = await User.findByIdAndUpdate(userId, { [option]: {likes : postId} },{new : true} )
    .catch(error => {
        console.log(error);
        res.sendStatus(400)
    })
    let post = await Post.findByIdAndUpdate(postId, { [option]: {likes : userId} },{new : true} )
    .catch(error => {
        console.log(error);
        res.sendStatus(400)
    })

    res.status(200).send(post)
}

