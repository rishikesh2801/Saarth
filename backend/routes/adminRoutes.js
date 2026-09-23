const express = require('express');
const router = express.Router();
const { auth, roleCheck } = require('../middleware/auth');
const User = require('../models/User');
const Alert = require('../models/Alert');

router.get('/tourists', auth, roleCheck(['POLICE', 'AIRPORT']), async (req, res) => {
  console.log(`[SURVEILLANCE] Request from: ${req.user.username} | Scope: ${req.user.state} | Query: ${req.query.state}`);
  try {
    const filter = { role: 'TOURIST' };

    if (req.user.role === 'POLICE' && req.user.state === 'All India') {
      if (req.query.state && req.query.state !== 'All India') {
        filter.state = req.query.state;
      }
    } else if (req.user.state) {
      filter.state = req.user.state;
    }

    if (req.user.district && req.user.state !== 'All India') {
      filter.district = req.user.district;
    } else if (req.query.district && req.query.district !== 'All Districts') {
      filter.district = req.query.district;
    }

    const tourists = await User.find(
      filter,
      'name username lastLocation origin state safetyScore panicActive destination district originalPassword routePlan activeTrips updatedAt profilePic'
    ).sort({ updatedAt: -1 }).limit(1000);

    res.json(tourists);
  } catch (error) {
    console.error('[TOURISTS ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get Incoming Tourists
router.get('/incoming', auth, roleCheck(['POLICE', 'AIRPORT']), async (req, res) => {
  try {
    const policeDistrict = req.user.district;
    const policeState = req.user.state;

    const filter = { role: 'TOURIST' };

    console.log(
      `[INCOMING] Request from: ${req.user.username} | State: ${policeState} | District: ${policeDistrict}`
    );

    if (!policeState || policeState === 'All India') {
      filter.destination = { $ne: 'Unknown' };
    } else {
      const target = policeDistrict || policeState;

      filter.$or = [
        { destinationDistrict: { $regex: target, $options: 'i' } },
        { destinationState: { $regex: target, $options: 'i' } },
        { destination: { $regex: target, $options: 'i' } },
        { 'routePlan.location': { $regex: target, $options: 'i' } },
        { 'activeTrips.placeName': { $regex: target, $options: 'i' } }
      ];

      if (policeDistrict) {
        filter.district = { $ne: policeDistrict };
      } else {
        filter.state = { $ne: policeState };
      }
    }

    console.log('[INCOMING] Filter:', filter);

    const tourists = await User.find(
      filter,
      'name username lastLocation origin state destination district routePlan activeTrips updatedAt profilePic phone'
    ).sort({ updatedAt: -1 }).limit(100);

    console.log(`[INCOMING] Found: ${tourists.length}`);

    res.json(tourists);

  } catch (error) {
    console.error('[INCOMING ERROR]', error);

    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
});


router.get('/stats', auth, roleCheck(['POLICE', 'AIRPORT']), async (req, res) => {
  try {
    const filter = { role: 'TOURIST' };

    if (req.user.role === 'POLICE' && req.user.state === 'All India') {
      if (req.query.state && req.query.state !== 'All India') {
        filter.state = req.query.state;
      }
    } else if (req.user.state) {
      filter.state = req.user.state;
    }

    if (req.user.district && req.user.state !== 'All India') {
      filter.district = req.user.district;
    } else if (req.query.district && req.query.district !== 'All Districts') {
      filter.district = req.query.district;
    }

    const total = await User.countDocuments(filter);

    const sosCount = await User.countDocuments({
      ...filter,
      $or: [
        { safetyScore: 0 },
        { panicActive: true }
      ]
    });

    res.json({ total, sosCount });

  } catch (error) {
    console.error('[STATS ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/search', auth, roleCheck(['POLICE', 'AIRPORT']), async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Search ID is required' });
    }

    const filter = {
      role: 'TOURIST',
      username: id
    };

    if (req.user.role === 'POLICE' && req.user.state === 'All India') {
      // Pull everything
    } else if (req.user.state) {
      filter.state = req.user.state;
    }

    if (req.user.district && req.user.state !== 'All India') {
      filter.district = req.user.district;
    }

    const tourist = await User.findOne(
      filter,
      'name username lastLocation origin state safetyScore panicActive destination district originalPassword routePlan activeTrips updatedAt profilePic'
    );

    res.json(tourist);

  } catch (error) {
    console.error('[SEARCH ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/districts', auth, roleCheck(['POLICE', 'AIRPORT']), async (req, res) => {
  try {
    const { state } = req.query;
    const filter = { role: 'TOURIST' };

    if (state && state !== 'All India') {
      filter.state = state;
    }

    if (req.user.role === 'POLICE' && req.user.state !== 'All India') {
      filter.state = req.user.state;
    }

    const districts = await User.distinct('district', filter);

    districts.sort();

    res.json(districts);

  } catch (error) {
    console.error('[DISTRICTS ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/fine', auth, roleCheck(['POLICE']), async (req, res) => {
  try {
    const { touristId, amount, reason } = req.body;

    const filter = {
      username: touristId
    };

    if (req.user.role === 'POLICE' && req.user.state === 'All India') {
      // Allow
    } else if (req.user.state) {
      filter.state = req.user.state;
    }

    if (req.user.district && req.user.state !== 'All India') {
      filter.district = req.user.district;
    }

    const user = await User.findOneAndUpdate(
      filter,
      { $push: { fines: { amount, reason } } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Fine issued',
      user
    });

  } catch (error) {
    console.error('[FINE ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Mark fine as paid and remove it
router.post('/pay-fine', auth, roleCheck(['POLICE']), async (req, res) => {
  try {
    const { touristId, fineId } = req.body;

    const filter = {
      username: touristId
    };

    if (req.user.role === 'POLICE' && req.user.state !== 'All India') {
      if (req.user.district) {
        filter.district = req.user.district;
      } else {
        filter.state = req.user.state;
      }
    }

    const user = await User.findOneAndUpdate(
      filter,
      { $pull: { fines: { _id: fineId } } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Fine marked as paid and cleared',
      user
    });

  } catch (error) {
    console.error('[PAY FINE ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Mark SOS as Resolved
router.post('/resolve-sos', auth, roleCheck(['POLICE']), async (req, res) => {
  try {
    const { touristId } = req.body;

    const filter = {
      username: touristId
    };

    if (req.user.role === 'POLICE' && req.user.state !== 'All India') {
      if (req.user.district) {
        filter.district = req.user.district;
      } else {
        filter.state = req.user.state;
      }
    }

    const user = await User.findOneAndUpdate(
      filter,
      {
        panicActive: false,
        panicReason: ''
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'SOS marked as resolved',
      user
    });

  } catch (error) {
    console.error('[RESOLVE SOS ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/efir', auth, roleCheck(['POLICE']), async (req, res) => {
  try {
    const { touristId, details } = req.body;

    const caseId = 'FIR' + Math.floor(100000 + Math.random() * 900000);

    const filter = {
      username: touristId
    };

    if (req.user.role === 'POLICE' && req.user.state === 'All India') {
      // Allow
    } else if (req.user.state) {
      filter.state = req.user.state;
    }

    if (req.user.district && req.user.state !== 'All India') {
      filter.district = req.user.district;
    }

    await User.findOneAndUpdate(
      filter,
      {
        $push: {
          efirs: {
            caseId,
            details
          }
        }
      }
    );

    res.json({
      success: true,
      caseId,
      message: 'E-FIR generated successfully',
      details
    });

  } catch (error) {
    console.error('[EFIR ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Post a new global alert
router.post('/alerts', auth, roleCheck(['POLICE']), async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      severity,
      type,
      scope
    } = req.body;

    let targetState = req.user.state;
    let targetDistrict = req.user.district;

    if (scope === 'STATE') {
      targetDistrict = null;
    } else if (scope === 'NATIONAL') {
      targetState = 'All India';
      targetDistrict = null;
    }

    const alertData = {
      title,
      description,
      location: location || targetDistrict || targetState,
      state: targetState,
      district: targetDistrict,
      severity,
      type
    };

    const alert = await Alert.create(alertData);

    res.json({
      success: true,
      alert
    });

  } catch (error) {
    console.error('[ALERT CREATE ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get all alerts
router.get('/alerts', auth, async (req, res) => {
  try {
    const alerts = await Alert.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(alerts);

  } catch (error) {
    console.error('[ALERT FETCH ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;