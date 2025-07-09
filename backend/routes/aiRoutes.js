const express = require('express');
const router = express.Router();
const { askLlama } = require('../controllers/aiController');

router.post('/ask-llama', askLlama);

module.exports = router;
