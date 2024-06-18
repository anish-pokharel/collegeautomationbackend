const mongoose = require('mongoose');

const studentInternalSchema = new mongoose.Schema({
  name: String,
  email: String,
  rollno: String,
  marks: Number,
});

const StudentInternalExam = mongoose.model('StudentInternalExam', studentInternalSchema);

module.exports = StudentInternalExam;
