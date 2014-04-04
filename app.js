
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var mongo = require('mongodb');


var app = express();

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/local';

mongo.Db.connect(mongoUri, function (err, db) {
  db.collection('mapMarker', function(er, collection) {
    collection.insert({'name': 'gym'}, {safe: true}, function(er,rs) {
    });
  });
});


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
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);


app.get('/users', user.list);


app.post('/submitScore', function (req, res){
  mongo.Db.connect(mongoUri, function (err, db){
    db.collection("scores", function (er, collection){
      var score = req.body.scores;
      var name = req.body.playerName;
      collection.insert({"score": score, "playerName": name}, function (err, r){});
      res.send("cool beans");
    });
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
