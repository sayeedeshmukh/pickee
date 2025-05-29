const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes (will add later)
app.get('/', (req, res) => {
  res.send('Welcome to Pickee API!');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(' Connected to MongoDB');
  app.listen(5000, () => {
    console.log(' Server running on http://localhost:5000');
});
}).catch((err) => {
  console.error(' MongoDB connection failed:', err.message);
});

const decisionRoutes = require('./routes/decisionRoutes');
app.use('/api/decisions', decisionRoutes);

const mindsetRoutes = require('./routes/mindsetRoutes');
app.use('/api/mindset', mindsetRoutes);

const prosConsRoutes = require('./routes/prosConsRoutes');
app.use('/api/proscons', prosConsRoutes);
