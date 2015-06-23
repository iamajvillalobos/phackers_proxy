// Require packages
var express = require('express');
var request = require('request');

// Declare server object
var app = express();

var TOKEN = process.env.TOKEN;

// Declare routes
app.get('/api/v1/users/', function (req, res) {
  var url = "https://teamastig.slack.com/api/users.list?token=" + TOKEN;
  var users = request.get(url, function (error, response, body) {
    var users_collection = JSON.parse(body);
      res.json(users_collection);
  });
});

// Spawn server instance
app.listen(process.env.PORT || 8888);
