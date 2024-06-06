const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware');
const JoinClub = require('../models/joinClubModel');

// Create a new joinClub record
router.post('/joinclub', verifyToken, async (req, res) => {
    try {
        const newJoinClub = new JoinClub({
            clubStatus: req.body.clubStatus,
            clubName: req.body.clubName,
            reason: req.body.reason,
            createdDate: Date.now()
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

// Get a single joinClub record by ID
router.get('/joinclub/:id', verifyToken, async (req, res) => {
    try {
        const joinClub = await JoinClub.findById(req.params.id);
        if (!joinClub) {
            return res.status(404).json({ message: 'Join club record not found' });
        }
        res.json(joinClub);
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
