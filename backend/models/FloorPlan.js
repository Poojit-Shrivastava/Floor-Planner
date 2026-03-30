const mongoose = require('mongoose');

const floorPlanSchema = new mongoose.Schema({
  floorNumber: { type: Number, required: true },
  layout: { type: Object, required: true },
  name: { type: String, default: "Untitled" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FloorPlan', floorPlanSchema);
