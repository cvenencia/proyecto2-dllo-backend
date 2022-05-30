const mongoose = require("mongoose")
const postLikeSchema = require("../schemas/post_like")
const PostLikeModel = mongoose.model("PostLike", postLikeSchema)

const {getUserWithToken} = require("./user")

async function getPostLikeCount(post_id){
    // TODO
    return 0
}

async function getIdsPostLikedByUser(user_id){
    // TODO
    // Must return a list of ObjectIds
    const { ObjectId } = require('mongodb')
    return [new ObjectId("6295319a7f93e67582b3592e"), new ObjectId("62952e2c6ba99cdf719ef5f6")]
}

async function likePost(data) {
    const {getPostById} = require("./post")
    const user = await getUserWithToken(data.token)
    const post = await getPostById(data.post_id)
    if (user && post) {
        const like = new PostLikeModel({
            post_id: post._id,
            user_id: user._id
        })
        const {errors} = await like.save().catch(err => err)
        return errors ? false : true
    } else {
        return false
    }
}

module.exports = {getPostLikeCount, likePost, getIdsPostLikedByUser}
