const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ValuationSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['marks', 'valuation']
  },
  filePath: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Valuation', ValuationSchema);
