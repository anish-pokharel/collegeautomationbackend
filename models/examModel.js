const mongoose = require('mongoose');

const excelDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,  
  },
  age: {
    type: Number,
    required: false,  
  },
});

const ExcelData = mongoose.model('ExcelData', excelDataSchema);

module.exports = ExcelData;
