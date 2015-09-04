var express = require('express');
var router = express.Router();
var ajax = require('najax');
var mongoose = require('mongoose');
var Record = mongoose.model('records');
var random = require('random-words');

router.get('/api/random', function(req, res) {
  words = random();
  res.json({
    random: words
  });
});

var request = {
  url: 'https://datamarket.accesscontrol.windows.net/v2/OAuth2-13',
  method: 'POST',
  contentType: 'application/x-www-form-urlencoded',
  data: {
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    grant_type: 'client_credentials',
    scope: 'http://api.microsofttranslator.com/'
  },
  success: function(data) {
    data = JSON.parse(data);
    var token = data.access_token;
    router.get('/api/token', function(req, res, next) {
      res.json({
        token: token
      });
    });
  },
  error: function(error) {
    console.log('Error: ' + error.status);
  }
};

ajax(request);

router.get('/', function(req, res) {
  words = random();
  res.render('index', {
    title: 'Node Translator',
  });
});

router.post('/api/records', function(req, res) {
  // console.log(req.body);
  if (req.body.name) {
    Record.find({name: req.body.name}, function(err, records) {
      res.send(records);
    });
  } else {
    res.sendStatus(400);
  }
});

router.post('/api/records/add', function(req, res) {
  if (req.body.name && req.body.langTo && req.body.langFrom && req.body.correct && req.body.incorrect) {
    new Record({name: req.body.name,
                langTo: req.body.langTo,
                langFrom: req.body.langFrom,
                correct: req.body.correct,
                incorrect: req.body.incorrect
              }).save(function(err, success) {
                console.log(success);
              });
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
