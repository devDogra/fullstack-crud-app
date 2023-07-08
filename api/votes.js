const router = require('express').Router(); 
const mongoose = require('mongoose'); 
const Vote = mongoose.model('Vote'); 

// EVENTUALLY: We do not want everyone/every usr to see who liked what, right?
router.get('/', async (req, res, next) => {
    try {
        const votes = await Vote.find();
        res.send(votes);
    } catch(err) {
        return next(err);
    }
})

router.get('/:voteId', async (req, res, next) => {
    try {
        const vote = await Vote.find();
        res.send(vote);
    } catch(err) {
        return next(err); 
    }
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

// Only allow the updation of the value of the vote
router.put('/:voteId', async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.voteId)) {
        return res.status(404).json({error: "Invalid ID"});
    }
    const {value} = req.body; 

    const allowedValues = Vote.schema.path('value').options.enum; 
    if (!allowedValues.includes(value)) {
        return res.status(400).json({error: "Invalid vote value"});
    }
    
    try {
        const vote = await Vote.findByIdAndUpdate(req.params.voteId, {value}); 
        if (!vote) throw new Error("Could not find Vote"); 
        res.status(200).json({ vote, message: "Success" });
    } catch(err) {
        return next(err); 
    }
})

router.patch(':/voteId', async (req, res, next) => {
    const data = req.body; 
    // const 
})

module.exports = router; 