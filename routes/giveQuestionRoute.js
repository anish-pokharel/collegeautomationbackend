const express = require('express');
const router = express.Router();
const ModelQuestion = require('../models/giveQuestionModel')
const verifyToken=require('../middleware')



router.post('/submit-model-question',verifyToken, async (req, res) => {
    try {
        const { subject, model_question } = req.body;
        const newModelQuestion = new ModelQuestion({
            subject: subject,
            model_question: model_question,
            // Handle file upload separately and save the file path or URL to the 'file' field
        });
        const savedModelQuestion = await newModelQuestion.save();
        res.status(201).json(savedModelQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/model-questions', async (req, res) => {
    try {
        const modelQuestions = await ModelQuestion.find();
        res.json(modelQuestions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/model-questions/:id', async (req, res) => {
    try {
        const modelQuestion = await ModelQuestion.findById(req.params.id);
        if (!modelQuestion) {
            return res.status(404).json({ message: 'Model question not found' });
        }
        res.json(modelQuestion);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/model-questions/:id', async (req, res) => {
    try {
        const modelQuestion = await ModelQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!modelQuestion) {
            return res.status(404).json({ message: 'Model question not found' });
        }
        res.json(modelQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/model-questions/:id', async (req, res) => {
    try {
        const modelQuestion = await ModelQuestion.findByIdAndDelete(req.params.id);
        if (!modelQuestion) {
            return res.status(404).json({ message: 'Model question not found' });
        }
        res.json({ message: 'Model question deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
