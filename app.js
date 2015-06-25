// Require packages
var express = require('express');
var request = require('request');
var cors = require('cors');
var bodyParser = require('body-parser');

// Declare server object
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

var TOKEN = process.env.TOKEN;
var DOMAIN = process.env.DOMAIN;

// Declare routes


app.get('/api/v1/users/', function (req, res, next) {
  var url = "https://"+ DOMAIN +".slack.com/api/users.list?token=" + TOKEN;
  var users = request.get(url, function (err, response, body) {
    if (err) return next(err);
    var users_collection = JSON.parse(body);
      res.json(users_collection.members.length);
  });
});

app.post('/api/v1/invite/', function (req, res, next) {
  if (!req.body.hasOwnProperty('email') || (!req.body.hasOwnProperty('time'))) {
    res.statusCode = 400;
    return res.send('Error 400: Parameters incorrect!');
  }

  var url = "https://" + DOMAIN + ".slack.com/api/users.admin.invite";
  var options = {
    t: req.body.time,
    email: req.body.email,
    token: TOKEN,
    set_active: true
  };

  var result = request.post({ url: url, form: options }, function (error, response, body) {
    res.json(JSON.parse(body));
  });
});

// Spawn server instance
app.listen(process.env.PORT || 8888);
