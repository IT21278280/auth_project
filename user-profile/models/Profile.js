const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  bio: String,
});
module.exports = mongoose.model('Profile', profileSchema);