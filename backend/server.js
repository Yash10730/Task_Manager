require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/projects', require('./src/routes/projectRoutes'));
// task routes are mounted inside projectRoutes
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
