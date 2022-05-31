const mongoose = require("mongoose")
const postSchema = require("../schemas/post")
const PostModel = mongoose.model("Post", postSchema)

const {getUserWithToken, getUserById} = require("./user")
const {getPostLikeCount, getIdsPostLikedByUser} = require("./post_like")
const {getPostComments} = require("./post_comment")
const {getIdsPostSavedByUser} = require("./post_save")
const {isFollower, getFollowed} = require("./user_follower.js")

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
        && (user._id.equals(currentUser._id) || await isFollower(currentUser, user))
        ) {
        const pipeline = [
            {$match: {user_id: user._id}}
        ]
        return await PostModel.aggregate(pipeline).exec()
    } else {
        return false
    }
}

async function getUserTimeline(token, user_id, page, limit) {
    // getFollowed() already checks for token and user_id to correspond to the same user
    const ids = await getFollowed(token, user_id)
    try {
        if (ids) {
            const pipeline = [
                {match: {user_id: {$in: ids}}},
                {$skip: page * limit},
                {$limit: limit}
            ]
            const posts = await PostModel.aggregate(pipeline).exec()
            return posts
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}

async function getUserPostsCount(user_id) {
    const user = await getUserById(user_id)
    if (user) {
        const pipeline = [
            {$match: {user_id: user._id}},
            {$count: "count"}
        ]
        return (await PostModel.aggregate(pipeline).exec())[0].count
    }
}

async function getPostsUserLiked(token, user_id) {
    const currentUser = await getUserWithToken(token)
    const user = await getUserById(user_id)
    if (user && currentUser
        && (user._id.equals(currentUser._id) || user.public_likes)
        ) {
        const ids = await getIdsPostLikedByUser(user._id)
        const pipeline = [
            {$match: {
                _id: {
                    $in: ids
                }
            }}
        ]
        return PostModel.aggregate(pipeline).exec()
    } else {
        return false
    }
}

async function getPostsSavedByUser(token, user_id) {
    const currentUser = await getUserWithToken(token)
    const user = await getUserById(user_id)
    if (user && currentUser && user._id.equals(currentUser._id)) {
        const ids = await getIdsPostSavedByUser(user._id)
        const pipeline = [
            {$match: {
                _id: {
                    $in: ids
                }
            }}
        ]
        return PostModel.aggregate(pipeline).exec()
    } else {
        return false
    }
}

module.exports = {createPost, getPostInformation, getPostById, getUserPosts, getPostsUserLiked, getPostsSavedByUser, getUserPostsCount, getUserTimeline}
