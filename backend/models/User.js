const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  username: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  originalPassword: { type: String }, // For demo airport history purposes

  role: { type: String, enum: ['TOURIST', 'AIRPORT', 'POLICE'], required: true },

  state: String, // Which state the police belongs to or tourist is in

  district: String, // Specific district number for granular tracking

  createdBy: { type: String }, // ID of airport who created

  // Tourist specifics

  name: String,

  aadhaar: String,

  phone: String,

  email: String,

  travelDetails: String,

  origin: { type: String, default: 'Unknown' },

  destination: { type: String, default: 'Unknown' },

  currentState: String,

  currentDistrict: String,

  destinationState: String,

  destinationDistrict: String,

  visaDuration: { type: Number, default: 30 }, // In days

  arrivalDate: { type: Date, default: Date.now },

  safetyScore: { type: Number, default: 100 },

  profilePic: String,

  lastLocation: { lat: Number, lng: Number },

  liveTracking: { type: Boolean, default: true },

  status: { type: String, default: 'ACTIVE' }, // ACTIVE, OFF_ROUTE, SUSPICIOUS

  fines: [{
    amount: Number,
    reason: String,
    date: { type: Date, default: Date.now }
  }],

  efirs: [{
    caseId: String,
    details: String,
    date: { type: Date, default: Date.now }
  }],

  routePlan: [{
    location: String,
    date: Date
  }],

  activeTrips: [{
    placeName: String,
    location: { lat: Number, lng: Number },
    date: { type: Date, default: Date.now },
    food: [String],
    places: [String],
    language: String
  }],

  currentPlannedDestination: {
    placeName: String,
    lat: Number,
    lng: Number,
    climate: String,
    crowdLevel: String
  },

  panicReason: { type: String },

  panicActive: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);