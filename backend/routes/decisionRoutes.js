const express = require('express');
const router = express.Router();

const { createDecision, getDecision } = require('../controllers/decisionController');
const auth = require('../middlewares/auth');

// these should be valid FUNCTIONS
router.post('/', authOptional, createDecision);
router.get('/:id', getDecision);

module.exports = router;


const { getDecisionAnalysis } = require('../controllers/analysisController');

router.get('/:id/analysis', getDecisionAnalysis);

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