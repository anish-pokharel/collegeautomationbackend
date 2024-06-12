const express = require('express');
const router = express.Router();
const ModelQuestion = require('../models/giveQuestionModel')
const verifyToken=require('../middleware')
const multer = require('multer');
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
  upload.single('file'),



router.post('/submit-model-question',verifyToken, upload.single('file'), async (req, res) => {
    try {
        const { subject, model_question } = req.body;
        const file = req.file;
        if(!file){
            return res.status(400).json({ error: 'No file uploaded' });
        }
        else{
            const filename = file.filename;
            const newModelQuestion = new ModelQuestion({
                subject,
                model_question,
                file:`http://localhost:3200/uploads/${filename}`
            });
            const savedModelQuestion = await newModelQuestion.save();
            res.status(201).json(savedModelQuestion);
        }
        
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



//Read One by email
router.get('/getmodelquestiongivenbyemail', verifyToken, async (req, res) => {
    try {
        const { email } = req.user;
        const user = await Signup.findOne({ email });
        const enrollment= await Enrollment.findOne(subject.teacher);
        
        // If the user is not found, handle the error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(user.name === enrollment.teacher){

            const question = await ModelQuestion.find(subject);

            // Check if question is an empty array
            if (!question || question.length === 0) {
                return res.status(404).json({ message: 'No model question found' });
               }
      
            if(enrollment.subjects === question.subject){
                
                res.json({ Model_Question: question });
            }
        }
       
    } catch (error) {
        console.error('Error fetching question:', error); // Log the error
        res.status(500).json({ message: 'Error fetching question', error: error.message });
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
