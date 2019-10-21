var express = require('express');
var router = express.Router();

var usersModel = require('../models/users');
var housesModel = require('../models/houses');
var coprosModel = require('../models/copros');
var invitsModel = require('../models/invitation');

var createId = require('../public/javascripts/createId.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* GET users listing in Copro. */
router.get('/copro', function(req, res, next) {
  coprosModel.findOne({"_id": req.query.idCopro})
  .populate('houses')
  .populate('syndicUsers')
  .populate('conseilSyndical')
  .exec(function(err, copro){
    res.json({copros: copro});
  })
});


/* POST users listing. */  // On devrait le mettre en UPDATE (CRUD)
router.post('/updateUserData', function(req, res, next) {
  var name = req.body.updateValue;
  var value = req.body.newValue;
  var query = {};
  query[name] = value;
  usersModel.findOneAndUpdate({token: req.body.token}, {$set : query}, function(err, user){
    res.json({
      result: query,
      users: user
    });
  });
});


/* POST Logs push in DB */ 
router.post('/coproSendLog', function(req, res, next) {

  coprosModel.findOne({"_id": req.body.tokenCopro}, function(err, copro){

    copro.logs.push({
      user: req.body.tokenUser,
      date_creation: Date.now(),
      type: req.body.type,
      titleType: req.body.titleType,
      privateOrNot: JSON.parse(req.body.privateOrNot),
      title: req.body.title,
      content: req.body.description
    })

    copro.save(
      function(error, copro) {
        res.json({
          copros: copro
        });
      }
    )  
    
  });

});

/* GET Invitation User to Copro */        // Rajouter Fonction Duplicata Email
router.get('/invite', function(req, res, next) {

  var invit = createId(5, 1);

  var newInvit = new invitsModel({
    CoproId: req.query.idCopro,
    mailUserInvited: req.query.mailToInvite,
    mailUserWhoInvite: req.query.mail,
    invitCode: invit,
    dateCreation: Date.now(),
    used: false,
  });

  newInvit.save(
    function(error, invit) {
      res.json({result: true, invit: invit.invitCode})
    }
  )
});

/* GET Retrive invitation for User to Copro */
router.get('/retriveInvite', function(req, res, next) {

  invitsModel.findOne({invitCode: req.query.invitCode}, function(err, invit){
    
    if(invit === null){
      res.json({result: false, error: 'Code erroné'})
    } else {
      if(req.query.invitCode === invit.invitCode && invit.used == false){
        invitsModel.updateOne({invitCode: req.query.invitCode}, {used: true}, function(err, invits){
          res.json({result: true, coproId: invit.CoproId, mail: invit.mailUserInvited, error: null})
        });
      } else if(req.query.invitCode === invit.invitCode && invit.used == true){
        res.json({result: false, error: 'Ce code a déjà été utilisé'})
      }
    }
    
  });

});


module.exports = router;
