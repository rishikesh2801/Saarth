const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  state: { type: String, default: 'All India' },
  district: { type: String },
  severity: { type: String, enum: ['INFO', 'WARNING', 'CRITICAL'], default: 'WARNING' },
  type: { type: String, enum: ['WEATHER', 'DISASTER', 'SECURITY'], default: 'DISASTER' }
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);
