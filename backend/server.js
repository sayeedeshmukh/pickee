const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

const allowedOrigins = [
  'https://oricaa.netlify.app',
  '*',  

];

function isAllowedOrigin(origin) {
  if (!origin) return true; // server-to-server / curl / same-origin
  if (allowedOrigins.includes(origin)) return true;
  // Local dev: allow any Vite port
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return true;
  return false;
}

app.use(
  cors({
    origin(origin, cb) {
      if (isAllowedOrigin(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);


// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to Pickee API!');
});

// Start server first so we can surface useful errors even if DB is down.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function connectMongoWithFallback() {
  const primary = process.env.MONGO_URI;
  const fallback = process.env.MONGO_URI_FALLBACK || 'mongodb://127.0.0.1:27017/oricaDB';

  const candidates = [primary, fallback].filter(Boolean);
  if (candidates.length === 0) {
    console.error('MongoDB connection failed: MONGO_URI is not set.');
    return;
  }

  let lastErr;
  for (const uri of candidates) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log('Connected to MongoDB');
      return;
    } catch (err) {
      lastErr = err;
      console.error('MongoDB connection failed:', err?.message || String(err));
    }
  }
  if (lastErr) {
    console.error('MongoDB connection failed (all candidates exhausted).');
  }
}

connectMongoWithFallback();

// Routes
const decisionRoutes = require('./routes/decisionRoutes');
app.use('/api/decisions', decisionRoutes);

const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

const prosConsRoutes = require('./routes/prosConsRoutes');
app.use('/api/proscons', prosConsRoutes);

const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/auth');
app.use('/api/auth', authRoutes);

// Protect /api/auth/profile
app.get('/api/auth/profile', authMiddleware, require('./controllers/authController').getProfile);
