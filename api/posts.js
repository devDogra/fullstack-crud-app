const router = require('express').Router(); 
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch(err) {
        res.json(err.message);
    }
})

router.get('/:postId', async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.postId)) return res.json();
    
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    }
    catch(err) {
        res.json(err.message);
    }
})

router.post('/', async (req, res, next) => {
    const postData = req.body; 
    const createdPost = await Post.create(postData);
    res.json(createdPost);
})

router.patch('/:postId', async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.postId)) return res.json();
    const data = req.body; 
    const post = await Post.findById(req.params.postId);
    const updatedPost = Object.assign(post, data);
    res.json(updatedPost);
})

router.put('/:postId', async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.postId)) return res.json();

    const data = req.body; 
    const post = await Post.findById(req.params.postId);
    const updatedPost = Object.assign(post, data);
    res.json(updatedPost);
})

router.delete('/:postId', async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.postId)) return res.json();

    const id = req.params.postId; 
    const deletedPost = await Post.findByIdAndDelete(id);
    res.json(deletedPost);
})

module.exports = router; 