const mongoose = require("mongoose")
const followRequestSchema = require("../schemas/follow_request")
const FollowRequestModel = mongoose.model("FollowRequest", followRequestSchema)

const {getUserById, getUserWithToken} = require("./user")
const { isFollower, followUser } = require("./user_follower")

async function requestFollow(token, requested_user_id) {
    const user = await getUserWithToken(token)
    const requested_user = await getUserById(requested_user_id)
    if (user && requested_user && !user._id.equals(requested_user._id)) {
        const exists = await getRequest({
            user_id: user._id,
            requested_user_id: requested_user._id
        })
        if (!exists && !isFollower(user, requested_user)) {
            const request = new FollowRequestModel({
                user_id: user._id,
                requested_user_id: requested_user._id
            })
            await request.save().catch(err => err)
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

async function respondRequest(token, request_id, action){
    const user = await getUserWithToken(token)
    const request = await getRequest({_id: request_id})
    if (request && user && user._id.equals(request.user_id)) {
        switch (action) {
            case "accept":
                request.active = false
                const follower = await getUserById(request.user_id)
                const followed = await getUserById(request.requested_user_id)
                await followUser(follower, followed)
                request.save().catch(err => err)
                return true
            case "reject":
                request.active = false
                request.save().catch(err => err)
                return true
            default:
                return false
        }
    } else {
        return false
    }
}

async function getRequest(data) {
    return await FollowRequestModel.findOne(data)
}

module.exports = {requestFollow, respondRequest}
