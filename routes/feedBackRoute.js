const express = require('express');
const router = express.Router();
const FeedbackModel = require('../models/FeedbackModel');
const verifyToken = require('../middleware');

router.post('/addFeedback', verifyToken, async (req, res) => {
    try {
        const newFeedback = new FeedbackModel({
            feedbackGroup: req.body.feedbackGroup,
            feedbackAbout: req.body.feedbackAbout
        });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback saved successfully', feedback: newFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Error creating feedback', error });
    }
});

router.get('/getFeedbackList', verifyToken, async (req, res) => {
    try {
        const feedbackList = await FeedbackModel.find();
        res.json({ feedbackList });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback list', error });
    }
});

router.get('/getFeedback/:id', verifyToken, async (req, res) => {
    try {
        const feedback = await FeedbackModel.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json({ feedback });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error });
    }
});

router.put('/updateFeedback/:id', verifyToken, async (req, res) => {
    try {
        const updatedFeedback = await FeedbackModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json({ message: 'Feedback updated successfully', feedback: updatedFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Error updating feedback', error });
    }
});

router.delete('/deleteFeedback/:id', verifyToken, async (req, res) => {
    try {
        const deletedFeedback = await FeedbackModel.findByIdAndDelete(req.params.id);
        if (!deletedFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json({ message: 'Feedback deleted successfully', feedback: deletedFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting feedback', error });
    }
});

module.exports = router;
