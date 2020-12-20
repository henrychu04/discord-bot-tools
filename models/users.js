const mongoose = require('mongoose');

const userScehma = mongoose.Schema({
  d_id: String,
  email: String,
  pw: String,
  login: String,
  webhook: String,
  cashoutAmount: Number,
  settings: {
    orderRefresh: String,
    adjustListing: String,
    maxAdjust: Number,
    manualNotif: Boolean,
  },
});

module.exports = mongoose.model('User', userScehma, 'users');
