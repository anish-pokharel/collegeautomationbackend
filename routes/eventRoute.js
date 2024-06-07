const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const verifyToken = require('../middleware');  

// CREATE - Add a new event
router.post('/addEvent', verifyToken, async (req, res) => {
    try {
        const newEvent = new Event({
            eventName: req.body.eventName,
            eventDate: req.body.eventDate,
            location: req.body.location,
            description: req.body.description,
        });

        await newEvent.save();
        res.json({ message: 'Event saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
});

// READ - Get the list of all events
router.get('/getEventList', verifyToken, async (req, res) => {
    try {
        const events = await Event.find();
        res.json({ events });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
});

// READ - Get a single event by ID
router.get('/getEvent/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ event });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
});

// UPDATE - Update an event by ID
router.put('/updateEvent/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event updated successfully', updatedEvent });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
});

// DELETE - Remove an event by ID
router.delete('/deleteEvent/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
});

module.exports = router;
