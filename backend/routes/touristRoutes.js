const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { auth, roleCheck } = require('../middleware/auth');
const User = require('../models/User');

// Get current tourist profile
router.get('/me', auth, roleCheck(['TOURIST']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const filter = { role: 'TOURIST', state: user.state };
    if (user.district) {
      filter.district = user.district;
    }
    const activeTouristsInDistrict = await User.countDocuments(filter);
    res.json({ ...user.toObject(), activeTouristsInDistrict });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Weather
router.get('/weather', auth, async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const https = require('https');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
    
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          res.json(parsedData);
        } catch (e) {
          res.status(500).json({ error: 'Failed to parse weather data' });
        }
      });
    }).on('error', (err) => {
      console.error("Backend weather fetch failed:", err);
      res.status(500).json({ error: 'Failed to fetch weather' });
    });
  } catch (error) {
    console.error("Backend weather fetch failed:", error);
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

// Update Profile (Pic, Name, etc.)
router.post('/profile', auth, roleCheck(['TOURIST']), async (req, res) => {
  try {
    const { name, phone, email, profilePic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { $set: { name, phone, email, profilePic } },
      { new: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Change Password
router.post('/change-password', auth, roleCheck(['TOURIST']), async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.originalPassword = newPassword; // Keep synced for demo transparency
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/location', auth, roleCheck(['TOURIST']), async (req, res) => {
  try {
    const { lat, lng } = req.body;
    let score = Math.floor(Math.random() * (100 - 70 + 1)) + 70;
    
    if (lat > 28.5 && lat < 28.6 && lng > 77.1 && lng < 77.2) {
      score = Math.floor(Math.random() * 40) + 10;
    }

    const status = (Math.random() < 0.05) ? 'OFF_ROUTE' : 'ACTIVE';

    const user = await User.findByIdAndUpdate(req.user.id, {
      lastLocation: { lat, lng },
      safetyScore: score,
      status: status
    }, { new: true });

    res.json({ success: true, safetyScore: score, location: { lat, lng }, status });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/panic', auth, roleCheck(['TOURIST']), async (req, res) => {
  try {
    const { lat, lng, reason } = req.body;
    
    await User.findByIdAndUpdate(req.user.id, {
      lastLocation: { lat, lng },
      safetyScore: 0,
      panicActive: true,
      panicReason: reason || 'Unknown Emergency'
    });

    res.json({ success: true, message: 'Emergency contacts and police notified.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/toggle-tracking', auth, roleCheck(['TOURIST']), async (req, res) => {
  try {
    const { enabled } = req.body;
    await User.findByIdAndUpdate(req.user.id, { liveTracking: enabled });
    res.json({ success: true, liveTracking: enabled });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/update-route', auth, roleCheck(['TOURIST']), async (req, res) => {
  try {
    const { routePlan } = req.body;
    await User.findByIdAndUpdate(req.user.id, { routePlan });
    res.json({ success: true, message: 'Route plan updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Targeted Alerts for the current Tourist
router.get('/alerts', auth, roleCheck(['TOURIST']), async (req, res) => {
  try {
    const tourist = await User.findById(req.user.id);
    if (!tourist) return res.status(404).json({ error: 'User not found' });

    // Filter alerts: National OR State-wide OR District-specific
    const filter = {
      $or: [
        { state: 'All India' },
        { state: tourist.state, district: { $in: [null, '', tourist.district] } }
      ]
    };

    const Alert = require('../models/Alert');
    const alerts = await Alert.find(filter).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/trips', auth, roleCheck(['TOURIST']), async (req, res) => {
  try {
    const { placeName, location, food, places, language, climate, crowdLevel } = req.body;
    
    const user = await User.findByIdAndUpdate(req.user.id, {
      $push: { activeTrips: { placeName, location, food, places, language } },
      currentPlannedDestination: { placeName, lat: location.lat, lng: location.lng, climate, crowdLevel },
      destination: placeName // Update legacy field for compatibility
    }, { new: true });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
