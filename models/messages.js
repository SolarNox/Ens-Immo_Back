var mongoose = require('mongoose');

var messagesSchema = mongoose.Schema({
  text: String,
  user: String,
  date_send: Date,
});

var messagesModel = mongoose.model('messages', messagesSchema);

module.exports = messagesModel;