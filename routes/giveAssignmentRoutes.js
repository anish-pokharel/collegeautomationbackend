const express = require('express');
const router = express.Router();
const multer = require('multer');
const Assignment = require('../models/giveAssignmentModel')
const verifyToken=require('../middleware')
const Signup=require('../models/signupModel');
const Enrollment=require('../models/enrollmentModel');

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



  router.post('/postGiveAssignments', verifyToken, upload.single('assignmentFile'), async (req, res) => {
    try {
        console.log('File received:', req.file); 
        const { subject, assignmentName, remarks } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        } else {
            const filename = file.filename;
            const assignment = new Assignment({
                subject,
                assignmentName,
                assignmentFile: `http://localhost:3200/uploads/${filename}`,
                remarks
            });
            const savedAssignment = await assignment.save();
            res.status(201).json(savedAssignment);
        }
    } catch (err) {
        console.error(err); 
        res.status(400).json({ message: err.message });
    }
});

router.get('/getGiveAssignments', async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


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


  

router.get('/getassignmentsgivenbyemail', verifyToken, async (req, res) => {
    try {
        const { email } = req.user;
        const user = await Signup.findOne({ email });
        const enrollment= await Enrollment.findOne(teacher);
        
        // If the user is not found, handle the error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(user.name === enrollment.teacher){

            const assignment = await Assignment.find(subject);

            // Check if assignment is an empty array
            if (!assignment || assignment.length === 0) {
                return res.status(404).json({ message: 'No assignment found' });
               }
      
            if(enrollment.subjects === assignment.subject){
                
                res.json({ Assignment: assignment });
            }
        }
       
    } catch (error) {
        console.error('Error fetching assignment:', error); // Log the error
        res.status(500).json({ message: 'Error fetching assignment', error: error.message });
    }
  });



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