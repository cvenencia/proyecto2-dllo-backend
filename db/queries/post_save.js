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
    const pipeline = [
        {$match: {user_id}}
    ]
    return (await PostSaveModel.aggregate(pipeline).exec()).map(p => p.post_id)
}

module.exports = {savePost, getIdsPostSavedByUser}
