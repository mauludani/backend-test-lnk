const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/email'); // Import email routes
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:3001', // Ganti dengan asal frontend Anda
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*'); // Or specify your frontend origin
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });


// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/email', emailRoutes); // Use email routes

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

module.exports = app;
