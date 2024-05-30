const express = require('express');
const router = express.Router();

const JoinClub = require('../models/joinClubModel');


router.post('/joinclub', async (req, res) => {
    try {
        const newjoinClub = new JoinClub({
          
            clubStatus: req.body.clubStatus,
            clubName: req.body.clubName,
            reason: req.body.reason,
            createdDate:Date.now()
        });
       
        await newjoinClub.save();
        res.json({ message: 'New Club Joined sucessfully ' });
    }
    catch (error) {
        res.json({ messgae: 'something is error', error });
    }
})


router.get('/getJoinedClub', async (req, res) => {
    const joinedClub = await JoinClub.find(id);
    res.json({ joinedClub: joinedClub });
})


module.exports = router;
