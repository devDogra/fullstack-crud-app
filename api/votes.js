const router = require('express').Router(); 
const mongoose = require('mongoose'); 
const passport = require("passport"); 
const Vote = mongoose.model('Vote'); 
const Post = mongoose.model('Post');

console.log("VOTE MODEL");
console.log(Vote); 

/**
 * CLEANUP:
 * PUT and PATCH have the same function as the MW
 * The ensureCanGetVote and ensureCanUpdateVote perms are basically the same
 * 
 */

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
    console.log({user, vote}); 
    if (vote.user == undefined) {
        // no user was supplied in the vote object's body
        return next(); 

    }
    if (user._id.toString() !== vote.user) {
        // User is trying to create a Vote in another user's name
        return res.status(401).json({error: "Users cannot create Votes in other users' name"})
    }

    console.log({user, vote}); 
    
    next();
}
async function setVoteOnRequest(req, res, next) {
    const voteId = req.params.voteId; 
    if (!mongoose.isValidObjectId(voteId)) return next();
    try {
        const vote = await Vote.findById(voteId);
        req.vote = vote; 
        next();
    } catch(err) {
        return next(err);
    }
}
// RN: A user can only get his votes
function ensureCanGetVote(req, res, next) {
    const user = req.user; 
    const vote = req.vote; 
    console.log(vote, user);
    if (user._id.toString() !== vote.user._id.toString()) {
        return res.status(403).send({error: "Users can only get their Votes"});
    }

    next();
}

// NOTE: This does not mean a user cannot vote on posts other than his!!
// This only means that a user can modify only HIS votes, the ones he made
function ensureCanUpdateVote(req, res, next) {
    const user = req.user; 
    const vote = req.vote; 
    console.log(vote, user);
    if (user._id.toString() !== vote.user._id.toString()) {
        return res.status(403).send({error: "Users can only update their Votes"});
    }
    next(); 
}

function ensureCanGetVotesOfUser(req, res, next) {
    // For now, if no query, then assume user trying to get his own votes
    const votesOwnerUserId = req.query.user || req.user._id.toString(); 
    const reqSenderUserId = req.user._id.toString();
    // Normal users can only get their own votes
    if (reqSenderUserId != votesOwnerUserId) {
        return res.status(403).send({error: "Users can only get their Votes"});
    }
    next();
}

// EVENTUALLY: We do not want everyone/every usr to see who liked what, right?
// REQ: /votes?user=:userId
// If No user query param, then trying to get ALL votes, which is forbidden. Should only be available to admins. 
// BUT: Will require pagination if we're to scale 
router.get('/', ensureAuthenticated, ensureCanGetVotesOfUser, async (req, res, next) => {
    try {
        // For now, if no query, then assume user trying to get his own votes
        const queryUserId = req.query.user || req.user._id.toString();
        const votes = await Vote.find({
            user: queryUserId
        });
        res.send(votes);
    } catch(err) {
        return next(err);
    }
})

router.get('/:voteId', ensureAuthenticated, setVoteOnRequest, ensureCanGetVote, async (req, res, next) => {
    try {
        const vote = await Vote.findById(req.params.voteId);
        res.send(vote);
    } catch(err) {
        return next(err); 
    }
})

// Will automatically update the associate Post's document s well 
router.post('/', ensureAuthenticated, ensureCanCreateVote, async (req, res, next) => {
    // const {user, post, value} = req.body;
    const {post, value} = req.body;
    const user = req.user._id.toString(); 

    if (!mongoose.isValidObjectId(user) || !mongoose.isValidObjectId(post)) {
        return res.status(404).json({error: "Invalid user or post"})
    }

    try {
        const vote = new Vote({user, post, value});
        console.log("vote");
        console.log(vote);
        const savedVote = await vote.save(); 

        // Also update the vote counts in the Post associated to which this newly created Vote is
        await Post.voteOnPost(post, savedVote);

        res.status(201).json({message: "Vote created succesfully"});

    } catch(err) {
        console.log(err.message);
        return res.status(403).json({error: `Could not create vote. REASON: ${err.message}`}); 
    }
})

router.delete('/:voteId', ensureAuthenticated, setVoteOnRequest, ensureCanUpdateVote, async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.voteId)) {
        return res.status(404).json({error: "Invalid ID"});
    }
    
    try {
        const voteToDelete = req.vote; 
        if (!voteToDelete) throw new Error("Could not find Vote"); 
        
        const deleteResult = await Vote.findByIdAndDelete(voteToDelete._id.toString());
        const result = await Post.deleteVoteOnPost(voteToDelete.post, voteToDelete);

        if (result.error) {
            return res.status(result.status).json({error: result.error});
        }
        return res.status(200).json({ voteToDelete, message: "Successfully deleted" });
    } catch(err) {
        return next(err); 
    }
})
// Will automatically update the associate Post's document s well 
async function updateVote(req, res, next) {
    if (!mongoose.isValidObjectId(req.params.voteId)) {
        return res.status(404).json({error: "Invalid ID"});
    }
    const {value} = req.body; 
    
    const allowedValues = Vote.schema.path('value').options.enum; 
    if (!allowedValues.includes(value)) {
        return res.status(400).json({error: "Invalid vote value"});
    }
    
    try {
        // Not doing .save cuz triggers schema validation in pre hook, which would throw an error because the newVote is just { value: value }, when findByIdAndUpdate is performing a partial update
        // const vote = await Vote.findByIdAndUpdate(req.params.voteId, {value}, {new: true}); 
        // const vote = await Vote.findById(req.params.voteId);
        const vote = req.vote; 
        if (!vote) throw new Error("Could not find Vote"); 
        vote.value = value;
        vote.$locals.skipPreSaveValidation = true; 
        const savedVote = await vote.save();
        const result = await Post.updateVoteOnPost(savedVote.post, savedVote);
        if (result.error) {
            return res.status(result.status).json({error: result.error});
        }
        return res.status(200).json({ vote, message: "Success" });
    } catch(err) {
        return next(err); 
    }
}
// Only allow the value of the vote to be updated
// Same as put
router.put('/:voteId', ensureAuthenticated, setVoteOnRequest, ensureCanUpdateVote, updateVote);
router.patch('/:voteId', ensureAuthenticated, setVoteOnRequest, ensureCanUpdateVote, updateVote);


module.exports = router; 