const express = require('express');
const router = express.Router();
const { getGeminiProsCons, getGeminiDecisionAnalysis } = require('../controllers/aiController');


router.post('/generate-pros-cons-gemini', getGeminiProsCons);

router.get('/decision-analysis-gemini/:decisionId', getGeminiDecisionAnalysis); 

module.exports = router;