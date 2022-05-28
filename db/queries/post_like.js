const mongoose = require("mongoose")
const postLikeSchema = require("../schemas/post_like")
const PostLikeModel = mongoose.model("PostLike", postLikeSchema)

const {getUserWithToken} = require("./user")

async function getPostLikeCount(post_id){
    // TODO
    return 0
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

module.exports = {getPostLikeCount, likePost}
