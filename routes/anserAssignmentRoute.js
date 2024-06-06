const express = require('express');
const router = express.Router();
const answerAssignment = require('../models/answerAssignmentModel')
const multer = require('multer'); 
const verifyToken=require('../middleware')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
  const upload = multer({ storage: storage });


router.post('/postAnswerAssignment', upload.single('file'), async (req, res) => {
    try {
      const { subject, assignment,assignmentFile, rollno } = req.body;
    
  
      const newAssignment = new answerAssignment({ subject, assignment, assignmentFile, rollno });
      await newAssignment.save();
      res.status(201).json(newAssignment);
    } catch (error) {
      res.status(500).json({ message: 'Error creating assignment', error });
    }
  });
  
  // Read All
  router.get('/getassignments', async (req, res) => {
    try {
      const assignments = await answerAssignment.find();
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching assignments', error });
    }
  });
  
  // Read One
  router.get('/getassignments/:id', async (req, res) => {
    try {
      const assignment = await answerAssignment.findById(req.params.id);
      if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching assignment', error });
    }
  });
  
  // Update
  router.put('/putassignments/:id', upload.single('file'), async (req, res) => {
    try {
      const { subject, assignment, rollno, remarks } = req.body;
      const updateData = { subject, assignment, rollno, remarks };
      if (req.file) updateData.file = req.file.path;
  
      const updatedAssignment = await answerAssignment.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updatedAssignment) return res.status(404).json({ message: 'Assignment not found' });
  
      res.json(updatedAssignment);
    } catch (error) {
      res.status(500).json({ message: 'Error updating assignment', error });
    }
  });
  
  // Delete
  router.delete('/delassignments/:id', async (req, res) => {
    try {
      const deletedAssignment = await answerAssignment.findByIdAndDelete(req.params.id);
      if (!deletedAssignment) return res.status(404).json({ message: 'Assignment not found' });
  
      res.json({ message: 'Assignment deleted', deletedAssignment });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting assignment', error });
    }
  });




  module.exports = router;
  