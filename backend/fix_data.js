const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = 'mongodb://localhost:27017/tourist_guard';

async function fixRohan() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const rohan = await User.findOne({ name: /rohan/i });
  if (rohan) {
    console.log('Found Rohan:', rohan.username, 'State:', rohan.state);
    if (!rohan.state) {
      // If state is missing, let's try to infer it from destination or set a default
      // Or just set it to match the current airport's likely state
      // The user is likely testing with a specific state.
      // I'll check all tourists with missing states.
      const updated = await User.updateMany(
        { role: 'TOURIST', state: { $exists: false } },
        { $set: { state: 'Delhi', district: 'New Delhi' } } // Fallback for testing
      );
      console.log('Updated tourists missing state:', updated.modifiedCount);
    }
  } else {
    console.log('Rohan not found');
  }
  process.exit();
}

fixRohan();
