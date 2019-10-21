var mongoose = require('mongoose');

var housesSchema = mongoose.Schema({
    numeroRue: String,
    libelleRue: String,
    CP: Number,
    ville: String,
    numeroImmeuble: String,
    numeroAppartement: String,
    etageAppartement: Number,
    numeroParking: String,
    numeroCave: String,
    codeImmeuble: String,
    codeImmeubleSecondaire: String,
    codeAccesLogement: String,
    tokenUsers: {proprio: String, locataire : String}
});

var housesModel = mongoose.model('houses', housesSchema);

module.exports = housesModel;