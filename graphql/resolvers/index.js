const bcrypt = require('bcryptjs');

// Models
const Event = require('../../models/event');
const User = require('../../models/user');

// Getters
const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch (e) {
        throw new Error(err)
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => ({
            ...event._doc,
            _id: event.id,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event.creator)
        }))
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(e => ({
                ...e._doc,
                _id: e.id,
                date: new Date(e._doc.date).toISOString(),
                creator: user.bind(this, e._doc.creator)
            }))
        } catch (err) {
            console.log(err);
        }
    },
    users: async () => {
        try {
            const users = await User.find();
            return users.map(u => ({ ...u._doc, _id: u.id, password: null }))
        } catch (err) {
            console.log(err);
        }
    },
    createEvent: async ({ eventInput }) => {
        const event = new Event({
            title: eventInput.title,
            description: eventInput.description,
            price: +eventInput.price,
            date: new Date(eventInput.date),
            creator: eventInput.creator,
        });
        try {
            const savedEvent = await event.save();
            const creator = await User.findById(event._doc.creator)
            if (!creator) {
                throw new Error('User not found')
            }
            creator.createdEvents.push(event)
            await creator.save()
            return {
                ...savedEvent._doc,
                _id: savedEvent.id,
                date: new Date(savedEvent._doc.date).toISOString(),
                creator: user.bind(this, savedEvent._doc.creator)
            };
        } catch (err) {
            console.log(err)
        }
    },
    createUser: async ({ userInput }) => {
        try {
            const existingUser = await User.findOne({ email: userInput.email });
            if (existingUser) {
                throw new Error('User exists already')
            }
            const hashedPassword = await bcrypt.hash(userInput.password, 12);
            const user = new User({
                email: userInput.email,
                password: hashedPassword,
            });
            const createdUser = await user.save();
            return { ...createdUser._doc, password: null, _id: createdUser.id }
        } catch (e) {
            console.log(e)
        }
    },
}