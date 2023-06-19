const router = require('express').Router(); 
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch(err) {
        return next(err);
    }
})

router.get('/:postId', async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.postId)) return res.json();
    
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    }
    catch(err) {
        return next(err);
    }
})

router.post('/', async (req, res, next) => {
    const postData = req.body; 
    try {
        const createdPost = await Post.create(postData);
        res.json(createdPost);
    } catch(err) {
        return next(err);
    }
})

router.patch('/:postId', async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.postId)) return res.json();
    const data = req.body; 
    try {
        const post = await Post.findById(req.params.postId);
        const updatedPost = Object.assign(post, data);
        res.json(updatedPost);
    } catch(err) {
        return next(err);
    }
})

router.put('/:postId', async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.postId)) return res.json();

    const data = req.body; 
    try {
        const post = await Post.findById(req.params.postId);
        const updatedPost = Object.assign(post, data);
        res.json(updatedPost);
    } catch(err) {
        return next(err);
    }
})

router.delete('/:postId', async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.postId)) return res.json();

    try {
        const id = req.params.postId; 
        const deletedPost = await Post.findByIdAndDelete(id);
        res.json(deletedPost);
    } catch(err) {
        return next(err);
    }
})

module.exports = router; 