const mongoose = require("mongoose")
const postCommentSchema = require("../schemas/post_comment")
const PostCommentModel = mongoose.model("PostComment", postCommentSchema)

const {getUserWithToken} = require("./user")

async function getPostComments(post_id){
    return await PostCommentModel.find({post_id}).exec()
}

async function commentPost(data) {
    const {getPostById} = require("./post")
    const user = await getUserWithToken(data.token)
    const post = await getPostById(data.post_id)
    if (user && post) {
        const comment = new PostCommentModel({
            post_id: post._id,
            user_id: user._id,
            comment: data.comment
        })
        const {errors} = await comment.save().catch(err => err)
        return errors ? false : true
    } else {
        return false
    }
}

module.exports = {getPostComments, commentPost}
