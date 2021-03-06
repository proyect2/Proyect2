const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  alias: String,
  email: String,
  password: String,
  pick: String,
  facebookID: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
