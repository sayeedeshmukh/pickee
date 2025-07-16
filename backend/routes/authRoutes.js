const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getProfile } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', getProfile);

module.exports = router; 