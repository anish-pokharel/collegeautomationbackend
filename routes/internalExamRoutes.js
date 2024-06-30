const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const Valuation = require('../models/internalExamModel');
const Signup= require('../models/signupModel');
const Subject=require('../models/userSubjectModel');
const Enrollment=require('../models/enrollmentModel');
const verifyToken = require('../middleware');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, 
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('file');

function checkFileType(file, cb) {
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: PDFs and Word Documents Only!');
  }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'karthikpokharel@gmail.com',
    pass: 'nbqr tojp uufx ikgj',
  }
});

router.post('/internalUpload',verifyToken, async(req, res) => {
  upload(req, res, async(err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (req.file == undefined) {
        res.status(400).send('No file selected');
      } else {
        const teacher = await Enrollment.findOne({'subjects.teacher' :req.user.email});
        if (!teacher) {
          return res.status(404).send('Teacher not found in enrollment');
        }
        const { subject}=req.body;s
        //console.log(teacher);
        const Subjects = teacher.subjects.find(sub => sub.name === subject);
        if (!Subjects) {
          return res.status(404).send('Subject not found for teacher');
        }
        const sub = await Subject.findOne({'subjects.name.': Subjects.name });
        if (!sub) {
          return res.status(404).send('Subject not found for students');
        }
        const user = await Signup.find({email:sub.userEmail}); 
        if(user.length===0){
          return res.status(404).send('No users enrolled in this subject');
        }

        // Extract emails of all users
        const userEmails = user.map(user => user.email).join(',');

        const newValuation = new Valuation({
          type: req.body.type,
          filePath: req.file.path,
          subject:req.body.subject
        });

        newValuation.save()
          .then(valuation => {
            const mailOptions = {
              from: 'karthikpokharel@gmail.com',
              to: userEmails,
              subject: 'New File Uploaded',
              text: `A new file has been uploaded with the following details:\n\nType: ${valuation.type}\nFile Path: ${valuation.filePath}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return res.status(500).send(error.toString());
              }
              res.json({
                message: 'Upload successful, email sent',
                data: valuation
              });
            });
          })
          .catch(err => res.status(500).send(err));
      }
    }
  });
});

module.exports = router;
