const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  displayName: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;