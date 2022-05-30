const mongoose = require("mongoose")
const userFollowerSchema = require("../schemas/post_like")
const UserFollowerModel = mongoose.model("UserFollower", userFollowerSchema)

async function isFollower(follower, user) {
    // TODO
    return true
}

async function getFollowersCount(user_id) {
    // TODO
    return 0
}

async function getFollowedCount(user_id) {
    // TODO
    return 0
}

module.exports = {isFollower, getFollowersCount, getFollowedCount}
