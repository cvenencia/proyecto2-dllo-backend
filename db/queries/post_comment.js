const mongoose = require("mongoose")
const postCommentSchema = require("../schemas/post_comment")
const PostCommentModel = mongoose.model("PostComment", postCommentSchema)

async function getPostComments(post_id){
    // TODO
    return []
}

module.exports = {getPostComments}
