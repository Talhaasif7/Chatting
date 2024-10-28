const Chat = require('../models/Chat');

exports.getChatMessages = async (req, res) => {
    const { senderId, receiverId } = req.params;
    try {
        const chats = await Chat.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
};

exports.saveMessage = async (req, res) => {
    const { sender, receiver, content } = req.body;
    try {
        const newMessage = new Chat({
            sender,
            receiver,
            content
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

exports.editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;

        const updatedMessage = await Chat.findByIdAndUpdate(messageId, { content }, { new: true });
        res.status(200).json(updatedMessage);
    } catch (error) {
        res.status(500).json({ error: 'Error editing message' });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        await Chat.findByIdAndDelete(messageId);
        res.status(200).json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting message' });
    }
};
