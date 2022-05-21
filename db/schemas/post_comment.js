const mongoose = require('mongoose')

const {Schema} = mongoose

const postLikeSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: [true, "User required."]
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Post",
        required: [true, "Post required."]
    },
    comment: {
        type: String,
        required: [true, "Comment required."]
    }
})

module.exports = postLikeSchema
