const express = require('express');
const router = express.Router();
const Enrollment = require('../models/enrollmentModel')


router.post('/enrollmentCreate', async (req, res) => {
    try {
        const { enrollmentKey, subjects } = req.body;
        const enrollment = new Enrollment({
          enrollment_key: enrollmentKey,
          subjects: subjects
        });
        const savedEnrollment = await enrollment.save();
        res.status(201).json(savedEnrollment);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });
  
  router.get('/enrollmentData', async (req, res) => {
    try {
      const enrollments = await Enrollment.find();
      res.json(enrollments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;