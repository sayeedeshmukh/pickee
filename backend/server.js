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
  "http://localhost:5173", // for local dev (Vite default)
  "https://oricaa.netlify.app/" 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to Pickee API!');
});

// MongoDB Connection (updated - no deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });

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
