var express = require('express');
var router = express.Router();
var ajax = require('najax');
var mongoose = require('mongoose');
var Record = mongoose.model('records');
var random = require('random-words');

router.get('/api/random', function(req, res) {
  res.json({
    random: random()
  });
});

router.get('/api/random/:num', function(req, res) {
  res.json({
    random: random(Number(req.params.num)),
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
      if (records) {
        res.statusCode = 200;
        res.json({records: records, code: 200});
      } else {
        res.statusCode = 404;
        res.json({message: "No records found for that name.", code: 404});
      }
    });
  } else {
    res.statusCode = 400;
    res.json({message: "Must provide a name", code: 400});
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
    res.statusCode = 200;
    res.json({message: 'Record Successfully added', code: 200});
  } else {
    res.statusCode = 400;
    res.json({message: 'Not all fields were given', code: 400});
  }
});

module.exports = router;
