var mongoose = require('mongoose');

var invitsSchema = mongoose.Schema({
    CoproId: String,
    mailUserInvited: String,
    mailUserWhoInvite: String,
    invitCode: String,
    dateCreation: Date,
    used: Boolean,
});

var invitsModel = mongoose.model('invits', invitsSchema);

module.exports = invitsModel;