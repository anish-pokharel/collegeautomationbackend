const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
