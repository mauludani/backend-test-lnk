const express = require('express');
const sendEmail = require('../services/emailService');
const jwt = require("jsonwebtoken");
const Email = require('../models/Email');

const router = express.Router();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  console.log(process.env.JWT_SECRET);
  if (token == null) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

router.post('/send', authenticateToken, async (req, res) => {
  const { email, date, description } = req.body;

  const subject = `Hi salam kenal`

  const from = req.user.email
  const to = email
  const created_by = req.user.username

  try {
    const emailInfo = await sendEmail(from, email, subject, description, `<p>${description}</p>`);

    const newEmail = new Email({ from, to, created_by, subject, date, description });
    await newEmail.save();

    res.status(201).json({ message: 'Email sent and recorded successfully', emailInfo });
  } catch (error) {
    res.status(500).send('Error sending or recording email');
  }
});

router.get('/fetch', authenticateToken, async (req, res) => {
  try {
    const username = req.user.username
    const emails = await Email.find({ created_by: username });

    const formattedEmails = emails.map((email) => ({
      title: email.subject,
      start: email.date,
      end: email.date,
    }));

    res.status(200).json(formattedEmails);
  } catch (error) {
    res.status(500).send('Error fetching emails');
  }
});


module.exports = router;
