const router = require('express').Router(); 

router.get('/', async (req, res, next) => {
    const posts = await getPostsFromDatabase();
    res.json(posts);
})

router.post('/', async (req, res, next) => {
    const postData = req.body; 
    const createdPost = await createNewPostInDatabase(postData);
    res.json(createdPost);
})

router.patch('/:postId', async (req, res, next) => {
    const data = req.body; 
    const updatedPost = await partiallyUpdatePostInDatabase(req.params.postId, data);
    res.json(updatedPost);
})

router.put('/:postId', async (req, res, next) => {
    const data = req.body; 
    const updatedPost = await updatePostInDatabase(req.params.postId, data); 
    res.json(updatedPost);
})

router.delete('/:postId', async (req, res, next) => {
    const id = req.params.postId; 
    const deletedPost = await deletePostInDatabase(id);
    res.json(deletedPost);
})

module.exports = router; 