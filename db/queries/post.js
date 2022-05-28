const mongoose = require("mongoose")
const postSchema = require("../schemas/post")
const PostModel = mongoose.model("Post", postSchema)

const {getUserWithToken} = require("../queries/user")

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

module.exports = {createPost}
