const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');

const secret = process.env.JWT_SECRET || 'supersecretkey_touristguard';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const setupDefaults = async () => {
  const airportExists = await User.findOne({ username: 'admin@airport.gov.in' });
  if (!airportExists) {
    const hashed = await bcrypt.hash('password123', 10);
    await User.create({ username: 'admin@airport.gov.in', password: hashed, role: 'AIRPORT' });
  }

  const policeExists = await User.findOne({ username: 'admin@police.gov.in' });
  if (!policeExists) {
    const hashed = await bcrypt.hash('password123', 10);
    await User.create({ username: 'admin@police.gov.in', password: hashed, role: 'POLICE', state: 'New Delhi', district: 'HQ' });
  }

  const northDelhiPoliceExists = await User.findOne({ username: 'northdelhi@police.gov.in' });
  if (!northDelhiPoliceExists) {
    const hashed = await bcrypt.hash('password123', 10);
    await User.create({ username: 'northdelhi@police.gov.in', password: hashed, role: 'POLICE', state: 'Delhi', district: 'North Delhi' });
  }

  const nationalExists = await User.findOne({ username: 'ministry@india.gov.in' });
  if (!nationalExists) {
    const hashed = await bcrypt.hash('ministry123', 10);
    await User.create({ username: 'ministry@india.gov.in', password: hashed, role: 'POLICE', state: 'All India', district: 'National Command Center' });
  }
};
setupDefaults();

router.post('/login', async (req, res) => {
  try {
    const { username, password, type } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    if (type === 'AIRPORT' && !username.endsWith('@airport.gov.in')) {
       return res.status(400).json({ error: 'Invalid domain for Airport login' });
    }
    if (type === 'POLICE' && !username.endsWith('@police.gov.in')) {
       return res.status(400).json({ error: 'Invalid domain for Police login' });
    }

    const payload = { id: user._id, role: user.role, username: user.username, state: user.state, district: user.district, profilePic: user.profilePic };
    const token = jwt.sign(payload, secret);
    
    res.json({ token, user: { 
      id: user._id, 
      role: user.role, 
      username: user.username, 
      name: user.name, 
      phone: user.phone,
      email: user.email,
      state: user.state, 
      district: user.district, 
      profilePic: user.profilePic 
    } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({ email, otp });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email - Tourist Guard',
      html: `
        <div style="background-color: #121212; color: #ffffff; font-family: sans-serif; padding: 40px; border-radius: 16px; max-width: 500px; margin: 0 auto;">
          <h2 style="text-align: center; color: #ffffff; font-size: 24px; margin-bottom: 20px;">Verification Code</h2>
          <p style="font-size: 16px; color: #cccccc;">Dear Traveler,</p>
          <p style="font-size: 16px; color: #cccccc; line-height: 1.5;">Your One-Time Password (OTP) for registering with Tourist Guard is:</p>
          
          <div style="background-color: #1e1e1e; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; color: #60a5fa; letter-spacing: 8px;">${otp}</span>
          </div>
          
          <p style="font-size: 14px; color: #9ca3af; text-align: center;">This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
          
          <div style="border-top: 1px solid #374151; margin: 30px 0;"></div>
          
          <p style="text-align: center; font-size: 14px; color: #6b7280;">Safe Travels, Incredible India 🇮🇳</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

router.post('/register-tourist', async (req, res) => {
  try {
    const { name, aadhaar, phone, email, travelDetails, currentState, currentDistrict, destinationState, destinationDistrict, createdBy, otp, visaDuration } = req.body;
    
    console.log("Registering tourist with visaDuration:", visaDuration);
    
    // Verify OTP
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    
    // Delete OTP record after use
    await Otp.deleteOne({ _id: otpRecord._id });

    const touristId = 'TID' + Math.floor(10000 + Math.random() * 90000);
    const password = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Default mock location if not provided
    const lat = 28.6139 + (Math.random() - 0.5) * 0.1;
    const lng = 77.2090 + (Math.random() - 0.5) * 0.1;

    const newUser = await User.create({
      username: touristId,
      password: hashedPassword,
      originalPassword: password,
      role: 'TOURIST',
      name,
      aadhaar,
      phone,
      email,
      travelDetails,
      origin: currentState || 'Unknown',
      destination: destinationDistrict || 'Unknown',
      currentState,
      currentDistrict,
      destinationState,
      destinationDistrict,
      state: currentState || destinationState,
      district: currentDistrict || destinationDistrict,
      createdBy: createdBy || 'SELF',
      lastLocation: { lat, lng },
      visaDuration: visaDuration || 30
    });

    // Send ID and Password to email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to India - Your Digital Tourist ID',
      html: `
        <div style="background-color: #121212; color: #ffffff; font-family: sans-serif; padding: 40px; border-radius: 16px; max-width: 500px; margin: 0 auto;">
          <h2 style="text-align: center; color: #ffffff; font-size: 24px; margin-bottom: 20px;">Identity Secured</h2>
          <p style="font-size: 16px; color: #cccccc;">Hello ${name},</p>
          <p style="font-size: 16px; color: #cccccc; line-height: 1.5;">Welcome to India! Your Digital Tourist ID has been successfully generated.</p>
          
          <div style="background-color: #1e1e1e; border-radius: 12px; padding: 25px; margin: 30px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Digital Tourist ID</p>
            <p style="margin: 0 0 20px 0; font-size: 28px; font-weight: bold; color: #60a5fa; font-family: monospace;">${touristId}</p>
            
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Secure Access Key</p>
            <p style="margin: 0; font-size: 28px; font-weight: bold; color: #f59e0b; font-family: monospace;">${password}</p>
          </div>
          
          <p style="font-size: 14px; color: #9ca3af;">Please use these credentials to access your dashboard at the Tourist Portal.</p>
          
          <div style="border-top: 1px solid #374151; margin: 30px 0;"></div>
          
          <p style="text-align: center; font-size: 14px; color: #6b7280;">Safe Travels, Incredible India 🇮🇳</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: 'Tourist ID Created Successfully and credentials sent to email',
      touristId,
      password,
      name
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
