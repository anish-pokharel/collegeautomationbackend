const express = require('express');
const router = express.Router()
const addClub = require('../models/addClubModel');
const verifyToken=require('../middleware')

router.post('/addClub',verifyToken,async (req, res) => {
    try {
        const newClub = new addClub({
            clubStatus: req.body.clubStatus,
            clubName: req.body.clubName,
            // createdDate: Date.now(),
        });
       
        await newClub.save();
        res.json({ message: 'Club saved sucessfully ' });
    }
    catch (error) {
        res.status(500).json({ messgae: 'something is error', error });
    }
})


router.get('/getClubList',verifyToken, async (req, res) => {
    const clubName = await addClub.find();
    res.json({ clubName: clubName });
})


module.exports = router;
