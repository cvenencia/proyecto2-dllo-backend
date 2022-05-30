const mongoose = require("mongoose")
const postSaveSchema = require("../schemas/post_save")
const PostSaveModel = mongoose.model("PostSave", postSaveSchema)

const {getUserWithToken} = require("./user")

async function savePost(data){
    const {getPostById} = require("./post")
    const user = await getUserWithToken(data.token)
    const post = await getPostById(data.post_id)
    if (user && post){
        const save = new PostSaveModel({
            post_id: post._id,
            user_id: user._id
        })
        const {errors} = await save.save().catch(err => err)
        return errors ? false : true
    } else {
        return false
    }
}

async function getIdsPostSavedByUser(user_id) {
    // TODO
    // Must return a list of ObjectIds
    const { ObjectId } = require('mongodb')
    return [new ObjectId("6295319a7f93e67582b3592e"), new ObjectId("62952e2c6ba99cdf719ef5f6")]
}

module.exports = {savePost, getIdsPostSavedByUser}
