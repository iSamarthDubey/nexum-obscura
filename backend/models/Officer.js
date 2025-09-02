// models/Officer.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const OfficerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, default: 'officer' },
  createdAt: { type: Date, default: Date.now }
});

OfficerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

OfficerSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('Officer', OfficerSchema);
