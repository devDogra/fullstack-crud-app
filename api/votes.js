const router = require('express').Router(); 
const mongoose = require('mongoose'); 
const passport = require("passport"); 
const Vote = mongoose.model('Vote'); 

console.log("VOTE MODEL");
console.log(Vote); 

// ensureCanCreateVote => check if trying to create vote's user matches the user aka tryna create his own vote


function ensureIsAdmin(req, res, next) {
    return res.status(403).send({error: "Insufficiant priviliges"})
}

// And upon success, sets req.user
function ensureAuthenticated(req, res, next) {
    passport.authenticate("jwt", { session: false })(req, res, next);
}

function ensureCanCreateVote(req, res, next) {
    const user = req.user; // User making the request
    const vote = req.body;
    if (user._id.toString() !== vote.user) {
        // User is trying to create a Vote in another user's name
        return res.status(401).json({error: "Users cannot create Votes in other users' name"})
    }
    console.log({user, vote}); 
    next();
}

function ensureCanGetVote(req, res, next) {
    next();
}
function ensureCanUpdateVote(req, res, next) {
    next();
}

// EVENTUALLY: We do not want everyone/every usr to see who liked what, right?
router.get('/', ensureAuthenticated, ensureCanGetVote, async (req, res, next) => {
    try {
        const votes = await Vote.find();
        res.send(votes);
    } catch(err) {
        return next(err);
    }
})

router.get('/:voteId', ensureAuthenticated, ensureCanGetVote, async (req, res, next) => {
    try {
        const vote = await Vote.findById(req.params.voteId);
        res.send(vote);
    } catch(err) {
        return next(err); 
    }
})

router.post('/', ensureAuthenticated, ensureCanCreateVote, async (req, res, next) => {
    const {user, post, value} = req.body;
    if (!mongoose.isValidObjectId(user) || !mongoose.isValidObjectId(post)) {
        return res.status(404).json({error: "Invalid user or post"})
    }

    try {
        const vote = new Vote({user, post, value});
        console.log("vote");
        console.log(vote);
        await vote.save(); 
        res.status(201).json({message: "Vote created succesfully"});

    } catch(err) {
        console.log(err.message);
        return res.status(403).json({error: `Could not create vote. REASON: ${err.message}`}); 
    }
})

// Only allow the value of the vote to be updated
router.put('/:voteId', ensureAuthenticated, ensureCanUpdateVote, async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.voteId)) {
        return res.status(404).json({error: "Invalid ID"});
    }
    const {value} = req.body; 

    const allowedValues = Vote.schema.path('value').options.enum; 
    if (!allowedValues.includes(value)) {
        return res.status(400).json({error: "Invalid vote value"});
    }
    
    try {
        const vote = await Vote.findByIdAndUpdate(req.params.voteId, {value}, {new: true}); 
        if (!vote) throw new Error("Could not find Vote"); 
        res.status(200).json({ vote, message: "Success" });
    } catch(err) {
        return next(err); 
    }
})

router.patch('/:voteId', ensureAuthenticated, ensureCanUpdateVote, async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.voteId)) {
        return res.status(404).json({error: "Invalid ID"});
    }
    const {value} = req.body; 

    const allowedValues = Vote.schema.path('value').options.enum; 
    if (!allowedValues.includes(value)) {
        return res.status(400).json({error: "Invalid vote value"});
    }
    
    try {
        const vote = await Vote.findByIdAndUpdate(req.params.voteId, {value}, {new: true}); 
        if (!vote) throw new Error("Could not find Vote"); 
        res.status(200).json({ vote, message: "Success" });
    } catch(err) {
        return next(err); 
    }
})
module.exports = router; 