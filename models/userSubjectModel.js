// models/userSubjectsModel.js
const mongoose = require('mongoose');

const userSubjectsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  subjects: [{ name: String, credit: String, code: String }],
});

module.exports = mongoose.model('UserSubjects', userSubjectsSchema);
