const mongoose = require("mongoose")
const userFollowerSchema = require("../schemas/user_follower")
const UserFollowerModel = mongoose.model("UserFollower", userFollowerSchema)
const {ObjectId} = require("mongodb")

async function isFollower(follower, user) {
    return await UserFollowerModel.findOne({
        follower_id: follower._id,
        followed_id: user._id
    }).exec() ? true : false
}

async function getFollowersCount(user_id) {
    return (await UserFollowerModel.find({
        followed_id: new ObjectId(user_id)
    }).exec()).length
}

async function getFollowedCount(user_id) {
    return (await UserFollowerModel.find({
        follower_id: new ObjectId(user_id)
    }).exec()).length
}

async function getFollowing(token, user_id) {
    const {getUserWithToken, getUserById, getUsersByIds} = require("./user")

    const currentUser = await getUserWithToken(token)
    const user = await getUserById(user_id)
    if (user && currentUser
        && (user._id.equals(currentUser._id) || await isFollower(currentUser, user))
        ) {
        const pipeline = [
            {$match: {
                follower_id: user._id
            }}
        ]
        const follows = await UserFollowerModel.aggregate(pipeline).exec()

        // Send only the IDs of the users
        return follows.map(f => f.followed_id)

        // Send all the user objects (?)
        // return await getUsersByIds(follows.map(f => f.followed_id))
    } else {
        return false
    }
}

async function getFollowers(token, user_id) {
    const {getUserWithToken, getUserById, getUsersByIds} = require("./user")

    const currentUser = await getUserWithToken(token)
    const user = await getUserById(user_id)
    if (user && currentUser
        && (user._id.equals(currentUser._id) || await isFollower(currentUser, user))
        ) {
        const pipeline = [
            {$match: {
                followed_id: user._id
            }}
        ]
        const follows = await UserFollowerModel.aggregate(pipeline).exec()

        // Send only the IDs of the users
        return follows.map(f => f.follower_id)

        // Send all the user objects (?)
        // return await getUsersByIds(follows.map(f => f.followed_id))
    } else {
        return false
    }
}

async function getFollowed(token, user_id) {
    const {getUserWithToken, getUserById, getUsersByIds} = require("./user")

    const currentUser = await getUserWithToken(token)
    const user = await getUserById(user_id)
    if (user && currentUser && user._id.equals(currentUser._id)) {
        const pipeline = [
            {$match: {
                follower_id: user._id
            }}
        ]
        const follows = await UserFollowerModel.aggregate(pipeline).exec()

        // Send only the IDs of the users
        return follows.map(f => f.followed_id)

        // Send all the user objects (?)
        // return await getUsersByIds(follows.map(f => f.followed_id))
    } else {
        return false
    }
}

async function followUser(follower, followed) {
    const follow = new UserFollowerModel({
        follower_id: follower._id,
        followed_id: followed._id
    })
    await follow.save().catch(err => err)
}

module.exports = {isFollower, getFollowersCount, getFollowedCount, getFollowers, getFollowed, getFollowing, followUser}
