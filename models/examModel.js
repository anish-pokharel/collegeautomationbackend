const mongoose = require('mongoose');

const excelDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,  
  },
  rollno: {
    type: Number,
    required: false,  
  },
});

const ExcelData = mongoose.model('ExcelData', excelDataSchema);

module.exports = ExcelData;
