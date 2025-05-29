const express = require('express');
const router = express.Router();

const { createDecision, getDecision } = require('../controllers/decisionController');

// these should be valid FUNCTIONS
router.post('/', createDecision);
router.get('/:id', getDecision);

module.exports = router;


const { getDecisionAnalysis } = require('../controllers/analysisController');

router.get('/:id/analysis', getDecisionAnalysis);

module.exports = router;