
const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  otp: String,
  date:String,
  present: { type: Boolean, default: false }
});

const Students = mongoose.model('student', studentSchema);
module.exports =Students;
