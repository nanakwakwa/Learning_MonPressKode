
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');

var mongo = require('mongodb');


var app = express();

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/local';


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/userScores.json', function (req, res){
  mongo.Db.connect(mongoUri, function (err, db){
    db.collection("scores", function (er, col){
      var d = col.find({}).toArray(function(err, x){
        console.log(x);
      });
      col.find({}).sort("name").toArray(function(e, x){
        res.send(x);
      });
    });
  });
});

app.get('/scores.json', function (req, res){
  mongo.Db.connect(mongoUri, function (err, db){
    db.collection("2048_scores", function (er, col){
      var user = req.query.username;
      var d = col.find(username: user).sort({score:-1}).limit(100).toArray
      (function(err,scoreData){
        res.send(scoreData);
      });
    });
  });
});


app.post('/submitScore', function (req, res){
  mongo.Db.connect(mongoUri, function (err, db){
    db.collection("scores", function (er, collection){
      var score = req.body.score;
      var name = req.body.playerName;
      collection.insert({"score": score, "playerName": name}, function (err, r){});
      res.send("cool beans");
    });
  });
});

app.post('/submit.json', function (req, res){
  mongo.Db.connect(mongoUri, function (err, db){
    db.collection("scores", function (er, collection){
      var username = req.body.username;
      var score = req.body.score;
      var grid = req.body.grid;
      var tStamp = new Date();
      collection.insert({"username": username, "score": score, "grid": grid}, function (err, r){});
      res.send("Yeah, I got it. Be cool man.");
    });
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
