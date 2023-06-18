const router = require('express').Router(); 
const mongoose = require('mongoose'); 
const User = mongoose.model('User');

router.get('/', async (req, res, next) => {
    const users = await User.find();
    res.json(users);
})

router.post('/', async (req, res, next) => {
    const userData = req.body; 
    const createdUser = await User.create(userData);
    res.json(createdUser);
})

router.patch('/:userId', async (req, res, next) => {
    const data = req.body; 
    const user = await User.findById(req.params.userId);
    const updatedUser = Object.assign(user, data);
    res.json(updatedUser);
})

router.put('/:userId', async (req, res, next) => {
    const data = req.body; 
    const user = await User.findById(req.params.userId);
    const updatedUser = Object.assign(user, data);
    res.json(updatedUser);
})

router.delete('/:userId', async (req, res, next) => {
    const id = req.params.userId; 
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
})

module.exports = router; 
