const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to Pickee API!');
});

// MongoDB Connection (updated - no deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
      console.log(' Server running on http://localhost:5000');
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
