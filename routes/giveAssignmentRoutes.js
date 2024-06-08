const express = require('express');
const router = express.Router();
const Assignment = require('../models/giveAssignmentModel')
const verifyToken=require('../middleware')





router.post('/postGiveAssignments',verifyToken, async (req, res) => {
    try {
        const assignment = new Assignment(req.body);
        const savedAssignment = await assignment.save();
        res.status(201).json(savedAssignment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all assignments
router.get('/getGiveAssignments', async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single assignment
router.get('/getGiveAssignments/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update an assignment
router.put('/putGiveAssignments/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.json(assignment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an assignment
router.delete('/giveAssignments/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.json({ message: 'Assignment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;