const express = require('express');
const router = express.Router();
const Form = require('../models/sponsoeshipRequestModel');
const verifyToken = require('../middleware');
const Signup = require('../models/signupModel');
// Create
router.post('/postsponsorship', verifyToken, async (req, res) => {
  try {
    const newForm = new Form({

      name: req.user.name,
      faculty: req.body.faculty,
      semester: req.body.semester,
      money: req.body.money,
      topic: req.body.topic,
      reason: req.body.reason,
      decision:req.body.decision
    });
    await newForm.save();
    res.status(201).json({message: "Sponsorship requested" ,newForm});
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

router.get('/getsponsorshipbyemail', verifyToken, async (req, res) => {
  try {
      const { email } = req.user;
      const user = await Signup.findOne({ email });

      // If the user is not found, handle the error
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      
      const sponsorship = await Form.find({ name: user.name });
      
      res.json({ Sponsorship: sponsorship });
     
  } catch (error) {
      console.error('Error fetching feedback:', error); // Log the error
      res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// Update
router.put('/putsponsorship:id', verifyToken, async (req, res) => {
  try {
    const {name}=req.user;
    const {  faculty, semester, topic, money, reason } = req.body;
    const updatedForm = await Form.findByIdAndUpdate(req.params.id, { name, faculty, semester, topic, money, reason }, { new: true });
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
