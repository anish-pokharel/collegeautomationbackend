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


router.put('/updateClub/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedClub = await addClub.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedClub) {
            return res.status(404).json({ message: 'Club not found' });
        }

        res.json({ message: 'Club updated successfully', updatedClub });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
});


router.delete('/deleteClub/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClub = await addClub.findByIdAndDelete(id);

        if (!deletedClub) {
            return res.status(404).json({ message: 'Club not found' });
        }

        res.json({ message: 'Club deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
})


module.exports = router;
