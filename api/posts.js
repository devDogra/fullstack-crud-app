const router = require('express').Router(); 
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

router.get('/', async (req, res, next) => {
    const posts = await Post.find();
    res.json(posts);
})

router.get('/:postId', async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    res.json(post);
})

router.post('/', async (req, res, next) => {
    const postData = req.body; 
    const createdPost = await Post.create(postData);
    res.json(createdPost);
})

router.patch('/:postId', async (req, res, next) => {
    const data = req.body; 
    const post = await Post.findById(req.params.postId);
    const updatedPost = Object.assign(post, data);
    res.json(updatedPost);
})

router.put('/:postId', async (req, res, next) => {
    const data = req.body; 
    const post = await Post.findById(req.params.postId);
    const updatedPost = Object.assign(post, data);
    res.json(updatedPost);
})

router.delete('/:postId', async (req, res, next) => {
    const id = req.params.postId; 
    const deletedPost = await Post.findByIdAndDelete(id);
    res.json(deletedPost);
})

module.exports = router; 