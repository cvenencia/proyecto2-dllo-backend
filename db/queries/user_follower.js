const mongoose = require("mongoose")
const userFollowerSchema = require("../schemas/post_like")
const UserFollowerModel = mongoose.model("UserFollower", userFollowerSchema)

async function isFollower(follower, user) {
    // TODO
    return true
}

module.exports = {isFollower}
