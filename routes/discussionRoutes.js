const express = require('express');
const router = express.Router();
const verifyToken=require('../middleware')
const Discussion = require('../models/discussionModel');


router.post('/discussion',verifyToken,  async (req, res) => {
    try {
        const newDiscussion = new Discussion({
            discussion_topic: req.body.discussion_topic,
            date: req.body.date,
            decision_by: req.user.name,
            decision: req.body.decision
        });
       
        await newDiscussion.save();
        res.json({ message: 'Discussion saved sucessfully ' });
    }
    catch (error) {
        res.json({ messgae: 'something is error', error });
    }
})


router.get('/getdiscussion', verifyToken, async (req, res) => {
    const discussion = await Discussion.find();
    res.json({ discussion: discussion });
})


module.exports = router;
