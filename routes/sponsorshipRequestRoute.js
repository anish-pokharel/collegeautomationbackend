const express = require('express');
const router = express.Router();
const Form = require('../models/sponsoeshipRequestModel');
const verifyToken=require('../middleware')

// Create
router.post('/postsponsorship', verifyToken, async (req, res) => {
  try {
    const { name, faculty, semester, amount1, amount2, amount3 } = req.body;
    const newForm = new Form({ name, faculty, semester, amount1, amount2, amount3 });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ message: 'Error creating form', error });
  }
});

// Read All
router.get('/getsponsorship', verifyToken, async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forms', error });
  }
});

// Read One
router.get('/getsponsorship/:id', verifyToken, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching form', error });
  }
});

// Update
router.put('/putsponsorship:id', verifyToken, async (req, res) => {
  try {
    const { name, faculty, semester, amount1, amount2, amount3 } = req.body;
    const updatedForm = await Form.findByIdAndUpdate(req.params.id, { name, faculty, semester, amount1, amount2, amount3 }, { new: true });
    if (!updatedForm) return res.status(404).json({ message: 'Form not found' });
    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: 'Error updating form', error });
  }
});

// Delete
router.delete('/delsponsorship:id', verifyToken, async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id);
    if (!deletedForm) return res.status(404).json({ message: 'Form not found' });
    res.json({ message: 'Form deleted', deletedForm });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting form', error });
  }
});

module.exports = router;
