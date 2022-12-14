import express from 'express';
import mongoose from 'mongoose';

import Event from '../models/Event.js';

const router = express.Router();

/* Fetch all events */
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find();

        res.status(200).json(events);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

/* Create new event */
export const createEvent = async (req, res) => {
    const { title, date } = req.body;

    const newEvent = new Event({ title, date })
 
    try {
        await newEvent.save();
        res.status(201).json(
            {
                type: "success",
                message: "Event has been added successfully"
            }
        );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

/* Delete singile event */
export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No event with id: ${id}`);

    await Event.findByIdAndRemove(id);

    res.json({ message: "Event deleted successfully." });
}

export default router;
