const express = require('express');
const sendEmail = require('../services/emailService');
const Email = require('../models/Email');

const router = express.Router();

// Route to send an email
router.post('/send', async (req, res) => {
  const { from, to, subject, date, description } = req.body;
  
  try {
    // Send the email
    const emailInfo = await sendEmail(to, subject, description, `<p>${description}</p>`);
    
    // Record the email in the database
    const newEmail = new Email({ from, to, subject, date, description });
    await newEmail.save();
    
    res.status(201).json({ message: 'Email sent and recorded successfully', emailInfo });
  } catch (error) {
    res.status(500).send('Error sending or recording email');
  }
});

module.exports = router;
