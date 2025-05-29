const express = require('express');
const router = express.Router();

const {
  addProsCons,
  getProsConsByDecision
} = require('../controllers/prosConsController');

// POST: Add new pro/con
router.post('/', addProsCons);

// GET: All pros/cons for a decision
router.get('/:decisionId', getProsConsByDecision);

module.exports = router;
