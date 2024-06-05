const mongoose = require('mongoose');

const formSponsorshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  faculty: { type: String, required: true },
  semester: { type: String, required: true },
  amount1: { type: Number, required: true },
  amount2: { type: Number, required: true },
  amount3: { type: Number, required: true }
});

const SponsorshipForm = mongoose.model('sponsorshipForm', formSponsorshipSchema);
module.exports = SponsorshipForm;
