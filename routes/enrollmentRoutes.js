const express = require('express');
const router = express.Router();
const Enrollment = require('../models/enrollmentModel')
const UserSubjects  = require('../models/userSubjectModel')
const verifyToken=require('../middleware')



router.post('/enrollmentCreate', async (req, res) => {
  try {
    const { enrollmentKey,semester, subjects } = req.body;
    const enrollment = new Enrollment({
      enrollment_key: enrollmentKey,
      semester: semester,
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


router.get('/enrollmentData/subjects', verifyToken, async (req, res) => {
  try {
    const { email } = req.user;
      const enrollments = await Enrollment.find({});
      const subjects = enrollments.flatMap(enrollment => enrollment.subjects.filter(subject =>subject.teacher === email));
      const count = subjects.length; // Get the count of subjects
      res.json({subjects, count});
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/subjectsList', verifyToken, async (req, res) => {
  try {
    // const { email } = req.user;
      const enrollments = await Enrollment.find({});
      const subjects = enrollments.flatMap(enrollment => enrollment.subjects);
      const count = subjects.length; // Get the count of subjects
      res.json({subjects, count});
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/postEnrollmentKeyForm', verifyToken, async (req, res) => {
  try {
    const { enrollment_key,userEmail } = req.body;
    
    const findEnrollmentKey = await Enrollment.findOne({ enrollment_key });
    if (!findEnrollmentKey) {
      console.log('Enrollment key is not found');
      return res.json({ message: 'Enrollment key is not found' });
    }

    console.log('Associated Subjects:', findEnrollmentKey.subjects);
    const enrolledSubjects = new UserSubjects({
      enrollment_key: findEnrollmentKey.enrollment_key,
      subjects: findEnrollmentKey.subjects,
      userEmail:req.user.email
    });

    await enrolledSubjects.save();


    res.json({ matchEnrollmentKey: true, message: 'Enrollment key is found', subjects: findEnrollmentKey.subjects });
  } catch (error) {
    console.log('Something went wrong', error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
});

router.get('/enrollmentDatabyEmail',verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const subject = await UserSubjects.findOne({ userEmail: userEmail });
    if (!subject) {
      return res.status(404).json({ message: 'subject not found' });
    }
    res.json(subject);
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



router.get('/subjects/:id', async (req, res) => {
  try {
    const subject = await Enrollment.findOne({ 'subjects._id': req.params.id });
    if (!subject) {
      return res.status(404).send({ message: 'Subject not found' });
    }
    res.send(subject.subjects[0]);
  } catch (error) {
    res.status(500).send({ message: 'Server Error' });
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

router.delete('/deleteSubject/:enrollmentId/:subjectCode', verifyToken, async (req, res) => {
  try {
      const { enrollmentId, subjectCode } = req.params;

      const enrollment = await Enrollment.findById(enrollmentId);
      if (!enrollment) {
          return res.status(404).json({ message: 'Enrollment not found' });
      }

      const subjectIndex = enrollment.subjects.findIndex(subject => subject.code === subjectCode);
      if (subjectIndex === -1) {
          return res.status(404).json({ message: 'Subject not found' });
      }

      enrollment.subjects.splice(subjectIndex, 1); // Remove the subject
      await enrollment.save();

      res.json({ message: 'Subject deleted successfully', enrollment });
  } catch (error) {
      console.error('Error deleting subject:', error);
      res.status(500).json({ message: 'Something went wrong', error });
  }
});

module.exports = router;