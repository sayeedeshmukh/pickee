const express = require('express');
const router = express.Router();

const {
  addProsCons,
  getProsConsByDecision,
  updateProsCons,
  deleteProsCons
} = require('../controllers/prosConsController');

// POST: Add new pro/con
router.post('/', addProsCons);

// GET: All pros/cons for a decision
router.get('/:decisionId', getProsConsByDecision);

// PUT: Update a pro/con
router.put('/:id', updateProsCons);

// DELETE: Delete a pro/con
router.delete('/:id', deleteProsCons);

module.exports = router;
