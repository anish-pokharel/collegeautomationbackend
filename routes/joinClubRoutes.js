const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware');
const JoinClub = require('../models/joinClubModel');
const Signup= require('../models/signupModel');
const Club=require('../models/addClubModel');

// Create a new joinClub record
router.post('/joinclub', verifyToken, async (req, res) => {
    try {
        const currentDate = new Date();
        const formattedDate = currentDate.toDateString(); // Format as 'Fri Jun 07 2024'

        const newJoinClub = new JoinClub({
            joinedBy:req.user.email,
            clubStatus: req.body.clubStatus,
            clubName: req.body.clubName,
            reason: req.body.reason,
            joinedDate: formattedDate,
            decision:req.body.decision
        });
        await newJoinClub.save();
        res.status(201).json({ message: 'New club joined successfully', joinClub: newJoinClub });
    } catch (error) {
        res.status(500).json({ message: 'Error creating joinClub record', error });
    }
});

// Get all joinClub records
router.get('/joinclub', verifyToken, async (req, res) => {
    try {
        const joinClubs = await JoinClub.find();
        res.json(joinClubs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching joinClub records', error });
    }
});

// Get a single joinClub record by email
router.get('/getjoinedclubbyemail', verifyToken, async (req, res) => {
    try {
        const {email}=req.user;
        const User=await Signup.findOne({email});
        const joinClub = await JoinClub.find({joinedBy: email});
        if (!joinClub) {
            return res.status(404).json({ message: 'Join club record not found' });
        }
        // Add user's name to each joinClub record
        const joinClubsWithName = joinClub.map(joinClub => ({
            ...joinClub._doc,
            joinedBy: User.name
        }));
        if(joinClubsWithName.decision=='Requested')
        {
            res.json({Requested_Clubs: joinClubsWithName});
        }
        else if(joinClubsWithName.decision=='Accepted')
        {
            res.json({Accepeted_Clubs: joinClubsWithName});
        }
        else if(joinClubsWithName.decision=='Rejected')
        {
            res.json({Rejected_Clubs:joinClubsWithName});
        }

        //res.json({JoinedClubs: joinClubsWithName});
        //res.json(joinClub);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching joinClub record', error });
    }
});


// Get a single joinClub record by email
router.get('/getjoinedclubbyclubname', verifyToken, async (req, res) => {
    try {
        const {email}=req.user;
        const User=await Signup.findOne({email});
        const clubs=await Club.findOne({contactEmail: email});
        const joinClub = await JoinClub.find(clubName);

        if(User.email===clubs.contactEmail){
            if (!joinClub) {
                return res.status(404).json({ message: 'Join club record not found' });
            }
            if(joinClub.clubName===clubs.clubName){
                // Add user's name to each joinClub record
                const joinClubsWithName = joinClub.map(joinClub => ({
                ...joinClub._doc,
                joinedBy: User.name
            }));
            if(joinClubsWithName.decision=='Requested')
                {
                    res.json({Requested_Clubs: joinClubsWithName});
                }
                else if(joinClubsWithName.decision=='Accepted')
                {
                    res.json({Accepeted_Clubs: joinClubsWithName});
                }
                else if(joinClubsWithName.decision=='Rejected')
                {
                    res.json({Rejected_Clubs:joinClubsWithName});
                }
            }
           
        }
        

        //res.json({JoinedClubs: joinClubsWithName});
        //res.json(joinClub);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching joinClub record', error });
    }
});



// Update a joinClub record
router.put('/joinclub/:id', verifyToken, async (req, res) => {
    try {
        const updatedJoinClub = await JoinClub.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedJoinClub) {
            return res.status(404).json({ message: 'Join club record not found' });
        }
        res.json({ message: 'Join club record updated successfully', joinClub: updatedJoinClub });
    } catch (error) {
        res.status(500).json({ message: 'Error updating joinClub record', error });
    }
});

// Delete a joinClub record
router.delete('/joinclub/:id', verifyToken, async (req, res) => {
    try {
        const deletedJoinClub = await JoinClub.findByIdAndDelete(req.params.id);
        if (!deletedJoinClub) {
            return res.status(404).json({ message: 'Join club record not found' });
        }
        res.json({ message: 'Join club record deleted successfully', joinClub: deletedJoinClub });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting joinClub record', error });
    }
});

module.exports = router;
