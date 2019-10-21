var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
  date_Inscription: Date,
  picture: String, // Je crois
  firstName: String,
  lastName: String,
  sexe: Boolean, // True pour Homme
  birthDate: String,
  email: String,
  emailPro: String,
  telephone: String,
  telephone2: String,
  salt: String,
  password: String,
  token: String,
  shareInfos: Boolean, //Autorise les partages des infos (tel/mail aux autres ouvertement)
  allowNotification: Boolean,
  copro: [String],
  questionSecrete: String
});

// Role User ?

var usersModel = mongoose.model('users', usersSchema);

module.exports = usersModel;