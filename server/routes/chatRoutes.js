const express = require('express');
const Message = require('../models/Chat');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
// Get all messages between two users
router.get('/:userId1/:userId2', async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 },
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// Send a new message
router.post('/', auth, async (req, res) => {
    const { sender, receiver, content } = req.body;
    if (sender !== req.user.id && receiver !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const message = new Message({ sender, receiver, content });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message' });
    }
});

// Mark a message as seen
router.put('/:messageId/seen', async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.seen = true;
        await message.save();
        res.status(200).json({ message: 'Message marked as seen' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking message as seen' });
    }
});

// Edit an existing message
router.put('/:messageId/edit', async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.content = content;
        message.edited = true;
        await message.save();
        res.status(200).json({ message: 'Message edited successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error editing message' });
    }
});

// Delete a message
router.delete('/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await message.remove();
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting message' });
    }
});

module.exports = router;
