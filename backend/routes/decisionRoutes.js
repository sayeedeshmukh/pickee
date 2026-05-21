const express = require('express');
const router = express.Router();

const { createDecision, getDecision, getUserDecisions } = require('../controllers/decisionController');
const { getDecisionAnalysis } = require('../controllers/analysisController');
const { getStillNotSure, submitStillNotSure } = require('../controllers/stillNotSureController');
const auth = require('../middlewares/auth');

// Create decision (auth optional)
router.post('/', authOptional, createDecision);

// Authenticated user history must be registered BEFORE "/:id"
router.get('/user/history', auth, getUserDecisions);

// Nested routes must be registered BEFORE "/:id"
router.get('/:id/analysis', getDecisionAnalysis);
router.get('/:id/still-not-sure', getStillNotSure);
router.post('/:id/still-not-sure', submitStillNotSure);

// Fetch a decision by id (keep last, it's the most generic)
router.get('/:id', getDecision);

module.exports = router;

// Optional auth middleware: attaches user if present, but doesn't require login
function authOptional(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // ignore invalid token, treat as anonymous
    }
  }
  next();
}