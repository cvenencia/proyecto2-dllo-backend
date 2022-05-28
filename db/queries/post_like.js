const mongoose = require("mongoose")
const postLikeSchema = require("../schemas/post_like")
const PostLikeModel = mongoose.model("PostLike", postLikeSchema)

async function getPostLikeCount(post_id){
    // TODO
    return 0
}

module.exports = {getPostLikeCount}
