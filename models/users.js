const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  alias: String,
  email: String,
  password: String,
  pick: String,
  //answers: //ejercicio marc
  facebookID: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
