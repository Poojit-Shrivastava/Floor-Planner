const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const floorPlanRoutes = require('./routes/floorPlans');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/floors', floorPlanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
