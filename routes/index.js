var express = require('express');
var router = express.Router();

var uid2 = require("uid2");
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");

var usersModel = require('../models/users');
var housesModel = require('../models/houses');
var coprosModel = require('../models/copros');

var editDate = require('../public/javascripts/date.js');
var editTime = require('../public/javascripts/time.js');


// const request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET User page. */
router.get('/user', function(req, res, next) {
  usersModel.findOne( {token: req.query.token}, function(err, user) {
      res.json({
        users: user,
      });
  });
});

/* GET Copro page. */
router.get('/copro', function(req, res, next) {
  coprosModel.findOne({ "_id": req.query.id})
  .populate('houses')
  .populate('syndicUsers')
  .populate('conseilSyndical')
  .exec(function(err, copro){
    console.log('Ici le populate copro', copro)
    console.log('Ici le populate Copro err', err)
    res.json({copros: copro});
  })
});


/* GET Login */
router.get('/signin', function(req, res, next) {
  var isUserExist;
  usersModel.find({email: req.query.email}, function(error, data){
    if(data.length == 1){
      var hash = SHA256(req.query.password + data[0].salt).toString(encBase64);
      if(hash === data[0].password){
        isUserExist = true;
      } else {
        isUserExist = "Mot de passe incorrect !";
      }
    } else if (data.length == 0) {
      isUserExist = false;
    } else {
      isUserExist = "Il y a trop d'utilisateurs avec le même mail et/, Compte(s) désactivé(s) !!";
    }
    res.json({
      result: isUserExist,
      users: data
    });
  })
});


/* POST SignUp */
router.post('/signup', function(req, res, next) {

  usersModel.find({email: req.body.email}, function(error, data){
    if(data.length == 0){
      var salt = uid2(32);
      
      var newUser = new usersModel({
        firstName: req.body.prenom,
        lastName: req.body.nom,
        email: req.body.email,
        salt : salt,
        password: SHA256(req.body.password + salt).toString(encBase64),
        token: uid2(32)
      });

      newUser.save(
        function(error, user) {
          res.json({result: true, users: user})
        }
      )
    } else {
      res.json({result: false, error: 'Mail invalide'})
    }
  })
});


/* GET Retrive Password. */
router.get('/retrivepassword', function(req, res, next) {
  var isUserExist;
  usersModel.find({email: req.query.email}, function(error, data){
    if (data.length == 1) {
      isUserExist = true;
    } else if (data.length == 0) {
      isUserExist = 'Mail invalide';
    } else {
      isUserExist = "Mail invalide !";
    }
    res.json({
      result: isUserExist,
      users: data
    });
  })
});


/* GET Recover Password. */ // Not finish
router.get('/recoverpassword', function(req, res, next) {
  var isUserExist;
  usersModel.find({email: req.query.email}, function(error, data){
    if (data.length == 1) {
      isUserExist = true;
    } else if (data.length == 0) {
      isUserExist = 'Mail invalide';
    } else {
      isUserExist = "Mail invalide !";
    }
    res.json({
      result: isUserExist,
      users: data
    });
  })
});

/* POST AddHouse */
router.post('/addhouse', function(req, res, next) {

  var newHouse = new housesModel({
    numeroRue: req.body.numeroRue,
    libelleRue: req.body.rue,
    CP: parseInt(req.body.codePostal, 10),
    ville: req.body.ville,
    numeroImmeuble: req.body.numeroImmeuble,
    numeroAppartement: req.body.numeroAppartement,
    etageAppartement: parseInt(req.body.etageAppartement, 10),
    numeroParking: req.body.numeroParking,
    numeroCave: req.body.numeroCave,
    codeImmeuble: req.body.codeImmeuble,
    codeImmeubleSecondaire: req.body.codeImmeubleSecondaire,
    codeAccesLogement: req.body.codeAccesLogement,
    tokenUsers: {proprio: (JSON.parse(req.body.proprioOuLoc) ? req.body.tokens : null), locataire : (JSON.parse(req.body.proprioOuLoc) ? null : req.body.tokens)}
  });

  newHouse.save(
    function(error, house) {
      res.json({result: true, houses: house})
    }
  )
});

/* POST AddBuildings */
router.post('/addbuildings', function(req, res, next) {


  usersModel.findOne({token: req.body.token}, function(err,user){

    housesModel.find( { $or: [{'tokenUsers.proprio': req.body.token}, {'tokenUsers.locataire': req.body.token}]}, function(err, house){

      if(JSON.parse(req.body.isInvited)){

        var query = {};
        
        var name1 = 'syndicUsers';
        var name2 = 'houses';

        var value1 = user._id;
        var value2 = house[0]._id;

        var name3 = 'conseilSyndical';
        var value3 = user._id;

        query[name1] = value1;
        query[name2] = value2;

        if(JSON.parse(req.body.inSyndic)){
          query[name3] = value3;
        }
        

        coprosModel.findOneAndUpdate({_id: req.body.idCopro}, {$push: query}, function(err,copro){
          res.json({result: true, copros : copro})
        });   

      } else {
        var newCopro = new coprosModel({
          nomCopro: req.body.nomCopro,
          date_creation: Date.now(),
          mail: req.body.email,
          numeroTel: req.body.tel,
          tokenPrez: (JSON.parse(req.body.prezCopro) ? req.body.token : null),
        });
      
        newCopro.buildings.push({
          numeroRue: req.body.numeroRue,
          libelleRue: req.body.rue,
          ville: req.body.ville,
          CP: parseInt(req.body.codePostal, 10),
          numeroImmeuble: req.body.numeroImmeuble,
          codeImmeuble: req.body.codeImmeuble,
          codeImmeubleSecondaire: req.body.codeImmeubleSecondaire
        })
    
        newCopro.syndicUsers.push(user._id) 
        newCopro.houses.push(house[0]._id)
    
        JSON.parse(req.body.inSyndic) ? newCopro.conseilSyndical.push(user._id) : null
        
        newCopro.logs.push({
          user: user.firstName + ' ' + user.LastName,
          date_creation: Date.now(),
          type: 'Création de la copropriété',
          title: 'Création de la copropriété',
          content: 'Création de la copropriété',
        })

        newCopro.save(
          function(error, copro) {
            res.json({result: true, copros: copro})
          }
        ) 
      }

       
    })
  });
});

/* POST AddCoproToUser */
router.post('/addCoproToUser', function(req, res, next) {

  usersModel.findOneAndUpdate({token: req.body.token}, {$push: {copro: req.body.idCopro}}, function(err,user){
    res.json({result: true})
  });    
});

/* GET Copro to Actu Timeline page. */
router.get('/coproToTimeline', function(req, res, next) {

  coprosModel.findOne({ "_id": req.query.id})
  .populate('houses')
  .populate('syndicUsers')
  .populate('conseilSyndical')
  .exec(function(err, copro){

    var data = copro.logs.map((log, key) => {
      var nLog={};
      nLog['time'] = editDate(log.date_creation) + '    ' + editTime(log.date_creation)
      if(log.title == ""){
        nLog['title'] = log.titleType
      } else {
        nLog['title'] = log.title
      }
      nLog['description'] = log.content    
      nLog['type'] = log.type
      nLog['privateOrNot'] = log.privateOrNot

      return nLog
    })

    res.json({copros: copro, editDate, editTime, data});
  })
});






module.exports = router;


// import express-fileupload
// import cors si bug
// import mongoose                 Done!
// import request
// import crypto-js                 Done!
// import uid2                      Done!
// import socket.io                 Done!
// import passport            si le temps de l'implementer
