const express = require('express');
const router = express.Router();
const Enrollment = require('../models/enrollmentModel')
const UserSubjects  = require('../models/userSubjectModel')
const verifyToken=require('../middleware')



router.post('/enrollmentCreate', async (req, res) => {
  try {
    const { enrollmentKey, subjects } = req.body;
    const enrollment = new Enrollment({
      enrollment_key: enrollmentKey,
      subjects: subjects,
    });
    const savedEnrollment = await enrollment.save();
    res.status(201).json(savedEnrollment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/enrollmentData',verifyToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.find();
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




router.post('/postEnrollmentKeyForm', verifyToken, async (req, res) => {
  try {
    const { enrollment_key } = req.body;
    // const userId = req.userId ? req.userId.id : null; 
    // const userId = req.userId;
    // const userData =verifyToken.req.userId
    console.log(userData);
    // if (!userId) {
    //   return res.status(400).json({ message: 'User ID not found' });
    // }
    const findEnrollmentKey = await Enrollment.findOne({ enrollment_key });
    if (!findEnrollmentKey) {
      console.log('Enrollment key is not found');
      return res.json({ message: 'Enrollment key is not found' });
    }

    console.log('Associated Subjects:', findEnrollmentKey.subjects);

    // const userSubjects = new UserSubjects({
    //   userId: userId,
    //   subjects: findEnrollmentKey.subjects,
    // });
    // await userSubjects.save();

    res.json({ matchEnrollmentKey: true, message: 'Enrollment key is found', subjects: findEnrollmentKey.subjects });
  } catch (error) {
    console.log('Something went wrong', error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
});


router.get('/enrollmentData/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/enrollmentUpdate/:id', async (req, res) => {
  try {
    const { enrollmentKey, subjects } = req.body;
    const updatedEnrollment = await Enrollment.findByIdAndUpdate(req.params.id, {
      enrollment_key: enrollmentKey,
      subjects: subjects
    }, { new: true });
    res.json(updatedEnrollment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/enrollmentDelete/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;