const express = require('express')
const router = express.Router()
router.use(express.json())
module.exports = router

router.use(( req, res, next ) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' ) {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
    }
    next();
})

const {
    createPost,
    getPostInformation,
    getUserPosts,
    getPostsUserLiked,
    getPostsSavedByUser
} = require("../db/queries/post")
const {likePost} = require("../db/queries/post_like")
const {commentPost} = require("../db/queries/post_comment")
const {savePost} = require("../db/queries/post_save")

router.post("/", async (req, res) => {
    if (req.body.token) {
        const errors = await createPost(req.body)
        if (!errors) {
            res.status(201).json({})
        } else {
            const message = Object.keys(errors).map(key => errors[key].message).join(" ")
            res.status(400).json({message})
        }
    } else {
        res.status(403).json({message: "Missing user token."})
    }
})

router.get("/", async (req, res) => {
    if (req.query.user_id && req.body.token) {
        const posts = await getUserPosts(req.body.token, req.query.user_id)
        if (posts) {
            res.status(200).json(posts)
        } else {
            res.status(400).json({message: "Error"})
        }
    } else if (req.body.post_id) {
        const post = await getPostInformation(req.body.post_id)
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(400).json({message: "Invalid post ID."})
        }
    } else {
        res.status(403).json({message: "Missing post ID."})
    }
})

router.get("/liked-by", async (req, res) => {
    if (req.query.user_id && req.body.token) {
        const posts = await getPostsUserLiked(req.body.token, req.query.user_id)
        if (posts) {
            res.status(200).json(posts)
        } else {
            res.status(400).json({message: "Invalid parameters."})
        }
    }
})

router.get("/saved-by", async (req, res) => {
    if (req.query.user_id && req.body.token) {
        const posts = await getPostsSavedByUser(req.body.token, req.query.user_id)
        if (posts) {
            res.status(200).json(posts)
        } else {
            res.status(400).json({message: "Invalid parameters."})
        }
    }
})

router.post("/like", async (req, res) => {
    if (req.body.post_id && req.body.token) {
        const valid = await likePost(req.body)
        if (valid) {
            res.status(201).json({})
        } else {
            res.status(400).json({message: "Invalid form."})
        }
    } else {
        res.status(403).json({message: "Missing parameters."})
    }
})

router.post("/save", async (req, res) => {
    if (req.body.post_id && req.body.token) {
        const valid = await savePost(req.body)
        if (valid) {
            res.status(201).json({})
        } else {
            res.status(400).json({message: "Invalid form."})
        }
    } else {
        res.status(403).json({message: "Missing parameters."})
    }
})

router.post("/comment", async (req, res) => {
    if (req.body.post_id && req.body.token && req.body.comment) {
        const valid = await commentPost(req.body)
        if (valid) {
            res.status(201).json({})
        } else {
            res.status(400).json({message: "Invalid form."})
        }
    } else {
        res.status(403).json({message: "Missing parameters."})
    }
})
