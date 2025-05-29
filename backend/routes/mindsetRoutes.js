const express = require('express');
const router = express.Router();
const { createMindset, getMindset } = require('../controllers/mindsetController');

router.post('/', createMindset); // POST /api/mindset
router.get('/:id', getMindset);  // GET /api/mindset/:id (decision ID)

module.exports = router;
