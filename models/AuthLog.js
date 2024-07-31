const mongoose = require('mongoose');

const authLogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  action: {
    type: String,
    enum: ['login', 'logout'],
    required: true,
  },
});

const AuthLog = mongoose.model('AuthLog', authLogSchema);

module.exports = AuthLog;
