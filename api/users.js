const router = require('express').Router(); 
const mongoose = require('mongoose'); 
const User = mongoose.model('User');

router.get('/', async (req, res, next) => {
    const users = await User.find();
    res.json(users);
})

router.get('/:userId', async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.userId)) return res.json();

    try {
        const user = await User.findById(req.params.userId);
        res.json(user);
    } catch (err) {
        return next(err);
    }
})


router.post('/', async (req, res, next) => {
    const userData = req.body; 
    try {
        const createdUser = await User.create(userData);
        res.json(createdUser);  
    } catch (err) {
        return next(err);   
    }
})

// Working
router.patch('/:userId', async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.userId)) return res.json();
    const data = req.body; 
    try {
        const user = await User.findById(req.params.userId);
        const updatedUser = Object.assign(user, data);
        await updatedUser.save();
        res.json(updatedUser);
    } catch (err) {
        return next(err);        
    }
})

router.put('/:userId', async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.userId)) return res.json();
    const data = req.body; 

    try {
        await User.validate(data); 
    } catch(err) { 
        return next(err);
    }

    try {
        let user = await User.findById(req.params.userId);
        user = Object.assign(user, data);
        user.save();
        res.json(user);
    } catch(err) {
        return next(err);
    }
})

router.delete('/:userId', async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.userId)) return res.json();

    const id = req.params.userId; 
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.json(deletedUser);
    } catch(err) {
        return next(err);
    }
})

module.exports = router; 
