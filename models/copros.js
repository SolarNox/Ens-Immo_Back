var mongoose = require('mongoose');

var buildingsSchema = mongoose.Schema({
    numeroRue: String,
    libelleRue: String,
    ville: String,
    CP: Number,
    numeroImmeuble: String,
    codeImmeuble: String,
    codeImmeubleSecondaire: String
   });
   
   var ProblemsSchema = mongoose.Schema({
        user: String,
        date_creation: Date,
        type: String,
        titleType: String,
        privateOrNot: Boolean,
        title: String,
        content: String,
   });

var coprosSchema = mongoose.Schema({
    nomCopro: String,
    date_creation: Date,
    mail: String,
    numeroTel: String,
    buildings: [buildingsSchema],
    houses: [{type: mongoose.Schema.Types.ObjectId, ref: "houses"}],
    syndicUsers: [{type: mongoose.Schema.Types.ObjectId, ref: "users"}], // All users from Copro
    conseilSyndical: [{type: mongoose.Schema.Types.ObjectId, ref: "users"}], // Les users qui gerent
    tokenPrez: String,
    logs: [ProblemsSchema]
});

var coprosModel = mongoose.model('copros', coprosSchema);

module.exports = coprosModel;

//[{type: mongoose.Schema.Types.ObjectId, ref: "stacks"}]