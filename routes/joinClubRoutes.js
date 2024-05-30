const express = require('express');
const router = express.Router();

const JoinClub = require('../models/joinClubModel');


router.post('/joinclub', async (req, res) => {
    try {
        const newClub = new JoinClub({
          
            clubStatus: req.body.clubStatus,
            clubName: req.body.clubName,
            position:req.body.position,
            reason: req.body.reason,
            createdDate:Date.now()
        });
       
        await newClub.save();
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
