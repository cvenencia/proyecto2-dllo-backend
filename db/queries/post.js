const mongoose = require("mongoose")
const postSchema = require("../schemas/post")
const PostModel = mongoose.model("Post", postSchema)

const {getUserWithToken, getUserById} = require("./user")
const {getPostLikeCount} = require("./post_like")
const {getPostComments} = require("./post_comment")
const {isFollower} = require("./user_follower.js")

async function createPost(data) {
    const {token, ...newData} = data
    const user = await getUserWithToken(token)
    if (user) {
        const post = new PostModel({
            user_id: user._id,
            ...newData
        })
        const {errors} = await post.save().catch(err => err)
        return errors
    } else {
        return {properties: {message: "Invalid user token."}}
    }
}

async function getPostInformation(post_id) {
    const post = await getPostById(post_id)
    if (post) {
        const likes = await getPostLikeCount(post._id)
        const comments = await getPostComments(post._id)
        return {
            likes,
            comments,
            img_url: post.img_url,
            bio: post.bio,
            author: post.user_id
        }
    } else {
        return false
    }
}

async function getPostById(post_id) {
    try {
        return await PostModel.findById(post_id).exec()
    } catch(err){
        return null
    }
}

async function getUserPosts(token, user_id) {
    const currentUser = await getUserWithToken(token)
    const user = await getUserById(user_id)
    if (user && currentUser
        && (user._id.equals(currentUser._id) || isFollower(currentUser, user))
        ) {
        const pipeline = [
            {$match: {user_id: user._id}}
        ]
        return PostModel.aggregate(pipeline).exec()
    } else {
        return false
    }
}

module.exports = {createPost, getPostInformation, getPostById, getUserPosts}
