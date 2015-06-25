// Require packages
var express = require('express');
var request = require('request');
var cors = require('cors');
var bodyParser = require('body-parser');


// Declare server object
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

// environment variables
var TOKEN = process.env.TOKEN || "xoxp-3359469240-3368537646-3525848797-5d232a";
var DOMAIN = process.env.DOMAIN || "phackers";

 //Declare routes
var apiRouter = express.Router();
app.use('/api/v1', apiRouter);

apiRouter.route('/users')
    .get(function (req, res, next) {
      var url = "https://" + DOMAIN + ".slack.com/api/users.list?token=" + TOKEN;

      var users = request.get(url, function (err, response, body) {
        if (err) return next(err);
        var users_collection = JSON.parse(body);
        res.json(users_collection.members.length);
      });
    });

apiRouter.route('/invite')
    .post(function (req, res, next) {
      if (!req.body.hasOwnProperty('email')) {
        res.statusCode = 400;
        return res.send('Error 400: Parameters incorrect!');
      }

      var url = "https://" + DOMAIN + ".slack.com/api/users.admin.invite";
      var options = {
        t: new Date().getTime(),
        email: req.body.email,
        token: TOKEN,
        set_active: true
      };

      var result = request.post({ url: url, form: options }, function (err, response, body) {
        if (err) return next(err);
        res.json(JSON.parse(body));
      });
    });

// Spawn server instance
app.listen(process.env.PORT || 8888);

// Ping app every 5 minutes
var http = require("http");
setInterval(function() {
  http.get("http://phackers-proxy.herokuapp.com");
}, 300000);
