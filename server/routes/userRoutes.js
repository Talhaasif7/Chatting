const express = require('express');
const User = require('../models/User'); // Add this line to import your User model
const { registerUser, loginUser } = require('../controllers/authController'); // Ensure proper import
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// Get all users (optional)
router.get('/', auth, async (req, res) => { // Ensure auth middleware is used here
    try {
        const users = await User.find({ _id: { $ne: req.userId } }); // Use req.userId instead of req.user._id
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

module.exports = router;
