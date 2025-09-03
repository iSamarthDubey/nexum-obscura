// Usage: node createOfficer.js
// This script creates an officer account in MongoDB with a hashed password.

const mongoose = require('mongoose');


const Officer = require('../backend/models/Officer');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexum-obscura';

async function createOfficer(username, password) {
  await mongoose.connect(MONGO_URI);
  const officer = new Officer({ username, password });
  await officer.save();
  console.log('Officer created:', username);
  await mongoose.disconnect();
}

// Change these values as needed
const username = 'DemoOfficer@NexumObscura';
const password = 'ObscuraCollective';

createOfficer(username, password)
  .catch(err => {
    console.error('Error creating officer:', err);
    process.exit(1);
  });
