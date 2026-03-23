const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Register
exports.registerUser = async (req, res) => {
  console.log('Register endpoint hit', req.body);
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials.' });
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout (client should just delete token)
exports.logoutUser = (req, res) => {
  res.json({ message: 'Logged out.' });
};

// Google login/sign-up:
// Frontend sends a Google `id_token` and we verify it server-side, then return our JWT.
exports.googleLogin = async (req, res) => {
  try {
    const idToken = req.body?.id_token || req.body?.idToken || req.body?.token;
    if (!idToken) {
      return res.status(400).json({ error: 'Missing Google id_token.' });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      return res.status(500).json({ error: 'Server is missing GOOGLE_CLIENT_ID.' });
    }

    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: googleClientId,
    });

    const payload = ticket?.getPayload?.();
    if (!payload?.email) {
      return res.status(400).json({ error: 'Invalid Google token payload.' });
    }

    const email = payload.email;
    const displayName = payload.name || email.split('@')[0];
    const baseUsername = (displayName || email.split('@')[0])
      .toString()
      .trim()
      .replace(/\s+/g, '')
      .slice(0, 20);

    let user = await User.findOne({ email });

    // Create user if it doesn't exist
    if (!user) {
      // Ensure username uniqueness (since User schema has `unique: true`)
      let username = baseUsername || email.split('@')[0];
      let suffix = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const exists = await User.findOne({ username });
        if (!exists) break;
        suffix += 1;
        username = `${baseUsername || email.split('@')[0]}${suffix}`;
      }

      const randomPassword = crypto.randomBytes(24).toString('hex');
      const hashed = await bcrypt.hash(randomPassword, 10);

      user = await User.create({ username, email, password: hashed });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    return res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    return res.status(401).json({ error: err?.message || 'Invalid Google token.' });
  }
};

// Get profile (protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 