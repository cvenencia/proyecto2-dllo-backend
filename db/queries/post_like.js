const mongoose = require("mongoose")
const postLikeSchema = require("../schemas/post_like")
const PostLikeModel = mongoose.model("PostLike", postLikeSchema)

const {getUserWithToken} = require("./user")

async function getPostLikeCount(post_id){
    const pipeline = [
        {$match: {post_id}},
        {$count: "count"}
    ]
    return (await PostLikeModel.aggregate(pipeline).exec()).length
}

async function getIdsPostLikedByUser(user_id){
    const pipeline = [
        {$match: {user_id}}
    ]
    return (await PostLikeModel.aggregate(pipeline).exec()).map(p => p.post_id)
}

async function getUserLikeCount(user_id) {
    const pipeline = [
        {$match: {user_id}}
    ]
    return (await PostLikeModel.aggregate(pipeline).exec()).length
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

module.exports = {getPostLikeCount, likePost, getIdsPostLikedByUser, getUserLikeCount}
