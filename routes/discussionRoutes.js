const express = require('express');
const router = express.Router();

const Discussion = require('../models/discussionModel');


router.post('/discussion', async (req, res) => {
    try {
        const newDiscussion = new Discussion({
            discussion_topic: req.body.discussion_topic,
            date: date.now(),
            decision_by: req.body.decision_by,
            decision: req.body.decision
        });
       
        await newDiscussion.save();
        res.json({ message: 'Discussion saved sucessfully ' });
    }
    catch (error) {
        res.json({ messgae: 'something is error', error });
    }
})


router.get('/getdiscussion', async (req, res) => {
    const discussion = await Discussion.find();
    res.json({ discussion: discussion });
})


module.exports = router;
