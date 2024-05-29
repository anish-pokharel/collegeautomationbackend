const mongoose = require('mongoose');
const SubjectSchema = new mongoose.Schema({
    enrollment_key: { type: String, required: true },
    subject1: { type: String, required: true },
    subject2: { type: String, required: true },
    subject3: { type: String, required: true },
    subject4: { type: String, required: true },
    subject5: { type: String, required: true },
  });
  
  const Subject = mongoose.model('Subject', SubjectSchema);
  module.exports = Subject;