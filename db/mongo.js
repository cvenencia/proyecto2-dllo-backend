const mongoose = require('mongoose')

async function connect(){ 
    await mongoose.connect(
        "mongodb://localhost:27017/picshar"
        )
    .then(() => {
        console.log("Connected with mongo")
    })
    .catch((e) => {
        console.log(e)
        console.log("Error connecting with mongo")
    })
}

async function connectTest(){ 
    await mongoose.connect(
        "mongodb://localhost:27017/picshar-test"
        )
    .then(() => {
        console.log("Connected with mongo")
    })
    .catch((e) => {
        console.log(e)
        console.log("Error connecting with mongo")
    })
    return mongoose
}

async function cleanDB(mongo){
    const userSchema = require("./schemas/user")
    await mongo.model('User', userSchema).deleteMany({})

    const userFollowerSchema = require("./schemas/user_follower")
    await mongo.model('UserFollower', userFollowerSchema).deleteMany({})

    const postSchema = require("./schemas/post")
    await mongo.model('Post', postSchema).deleteMany({})

    const postSaveSchema = require("./schemas/post_save")
    await mongo.model('PostSave', postSaveSchema).deleteMany({})

    const postLikeSchema = require("./schemas/post_like")
    await mongo.model('PostLike', postLikeSchema).deleteMany({})

    const postCommentSchema = require("./schemas/post_comment")
    await mongo.model('PostComment', postCommentSchema).deleteMany({})

    const followRequestSchema = require("./schemas/follow_request")
    await mongo.model('FollowRequest', followRequestSchema).deleteMany({})
}

module.exports = {connect, connectTest, cleanDB}
