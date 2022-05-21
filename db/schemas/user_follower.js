const mongoose = require('mongoose')

const {Schema} = mongoose

const userFollowerSchema = new Schema({
    follower_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: [true, "Follower required."]
    },
    followed_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: [true, "Followed required."]
    }
})

module.exports = userFollowerSchema
