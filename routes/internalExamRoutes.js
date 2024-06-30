const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const Valuation = require('../models/internalExamModel');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, 
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

router.post('/internalUpload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (req.file == undefined) {
        res.status(400).send('No file selected');
      } else {
        const newValuation = new Valuation({
          type: req.body.type,
          filePath: req.file.path
        });

        newValuation.save()
          .then(valuation => {
            const mailOptions = {
              from: 'karthikpokharel@gmail.com',
              to: 'recipient-email@example.com',
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
