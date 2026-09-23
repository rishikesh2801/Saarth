const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Using Email:', process.env.EMAIL_USER);
console.log('Using Pass:', process.env.EMAIL_PASS ? '*****' : 'Not Set');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER, // Send to self
  subject: 'Test Email from Tourist Guard',
  text: 'This is a test email to verify credentials.'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});
