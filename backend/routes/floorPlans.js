const express = require('express');
const router = express.Router();
const FloorPlan = require('../models/FloorPlan');

// POST /api/floors/save
router.post('/save', async (req, res) => {
  try {
    const { floorNumber, layout, name } = req.body;
    
    const savedPlan = await FloorPlan.findOneAndUpdate(
      { floorNumber, name: name || "Untitled" }, 
      { layout, name: name || "Untitled", floorNumber }, 
      { new: true, upsert: true }
    );
    
    res.status(200).json(savedPlan);
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/floors
router.get('/', async (req, res) => {
  try {
    const plans = await FloorPlan.find().sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/floors/:id
router.get('/:id', async (req, res) => {
  try {
    const plan = await FloorPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.status(200).json(plan);
  } catch (error) {
    console.error('Fetch by ID error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
