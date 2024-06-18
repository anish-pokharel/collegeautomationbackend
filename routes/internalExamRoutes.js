const express = require('express');
const router = express.Router();
const Student = require('../models/internalExamModel');
const nodemailer = require('nodemailer');

// Route to submit marks
router.post('/submitMarks', async (req, res) => {
  const { students } = req.body;

  try {
    // Insert students into the database
    const insertedStudents = await Student.insertMany(students);

    // Sending emails
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'karthikpokharel@gmail.com',
        pass: 'nbqr tojp uufx ikgj',
      },
    });

    // Prepare and send emails to each student
    for (let student of insertedStudents) {
      let mailOptions = {
        from: 'karthikpokharel@gmail.com',
        to: student.email,
        subject: 'Marks Submission',
        text: `Dear ${student.name}, your marks have been recorded.`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${student.email}`);
    }

    res.status(200).send(insertedStudents);
  } catch (error) {
    console.error('Error submitting marks and sending emails:', error);
    res.status(500).send(error.message);
  }
});

module.exports = router;

module.exports = router;
