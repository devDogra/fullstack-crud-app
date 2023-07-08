const router = require('express').Router(); 
const mongoose = require('mongoose'); 
const Vote = mongoose.model('Vote'); 

// EVENTUALLY: We do not want everyone/every usr to see who liked what, right?
router.get('/', async (req, res, next) => {
    const votes = await Vote.find();
    res.send(votes);
})

router.get('/:voteId', async (req, res, next) => {
    const vote = await Vote.find();
    res.send(vote);
})

router.post('/', async (req, res, next) => {
    const {user, post, value} = req.body;
    if (!mongoose.isValidObjectId(user) || !mongoose.isValidObjectId(post)) {
        return res.status(404).json({error: "Invalid user or post"})
    }

    try {
        const vote = new Vote({user, post, value});
        console.log(vote);
        await vote.save(); 
        res.status(201).json({message: "Vote created succesfully"});

    } catch(err) {
        console.log(err.message);
        return res.status(403).json({error: `Could not create vote. REASON: ${err.message}`}); 
    }
})

module.exports = router; 