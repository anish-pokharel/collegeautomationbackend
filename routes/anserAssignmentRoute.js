const express = require('express');
const router = express.Router();
const answerAssignment = require('../models/answerAssignmentModel')
const multer = require('multer'); 
const verifyToken=require('../middleware')
const Signup = require('../models/signupModel');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
  const upload = multer({ storage: storage });
  upload.single('assignmentFile'),

router.post('/postAnswerAssignment',verifyToken, upload.single("assignmentFile"),  async (req, res) => {
    try {
      const { rollno }= req.user;
      const { subject, assignment } = req.body;
      // const assignmentFile= req.file.buffer.toString('base64');

       const {filename}= req.file;
       if(!filename){
        return res.status(400).json({ error: 'No file uploaded' });
        }else{
          const newAssignment = new answerAssignment({ subject, assignment, assignmentFile:`http://localhost:3200/uploads/${filename}`, rollno });
          await newAssignment.save();
          res.status(201).json({message:"Assignment submited successfully.", newAssignment});
        }
      
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
  
//Read One by email
  router.get('/getassignmentsbyemail', verifyToken, async (req, res) => {
    try {
        const { email } = req.user;
        const user = await Signup.findOne({ email });
  
        // If the user is not found, handle the error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const assignment = await answerAssignment.find({ rollno: user.rollno });
         // Check if assignment is an empty array
        if (!assignment || assignment.length === 0) {
          return res.status(404).json({ message: 'No assignment found' });
        }
        res.json({ Assignment: assignment });
       
    } catch (error) {
        console.error('Error fetching assignment:', error); // Log the error
        res.status(500).json({ message: 'Error fetching assignment', error: error.message });
    }
  });


  // // Update
  // router.put('/putassignments/:id', upload.single('assignmentFile'), async (req, res) => {
  //   try {
  //     const { subject, assignment, rollno, remarks } = req.body;
  //     const updateData = { subject, assignment, rollno, remarks };
  //     if (req.file) updateData.file = req.file.path;
  
  //     const updatedAssignment = await answerAssignment.findByIdAndUpdate(req.params.id, updateData, { new: true });
  //     if (!updatedAssignment) return res.status(404).json({ message: 'Assignment not found' });
  
  //     res.json(updatedAssignment);
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error updating assignment', error });
  //   }
  // });
  
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
  