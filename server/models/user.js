var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  username: String,
  password: String,
  picture: String,
  userID: String,
  joined: { type: Date, default: Date.now()},
  lessonsets: {
  	type: [String]
  }

});
var User = mongoose.model('User', userSchema);
module.exports = User;