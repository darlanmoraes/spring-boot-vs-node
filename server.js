var cluster = require('cluster');

if (cluster.isMaster) {
  var cpuCount = require('os').cpus().length;
  for (var i = 0; i < cpuCount; i += 1) {
      cluster.fork();
  }
} else {
  var express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      assert = require('assert'),
      MongoClient = require('mongodb').MongoClient;

  var person;
  var url = 'mongodb://mongo:27017/db';
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    person = db.collection('person');
    app.listen(8080, function () {
      console.log('Example app listening on port 8080!');
    });
  });

  app.use(bodyParser.json());

  app.get('/persons', function (req, res) {
    person.find().toArray(function(err, items) {
       assert.equal(null, err);
       res.json(items);
    });
  });

  app.post('/persons', function (req, res) {
    person.insert(req.body, function(err, result){
      assert.equal(null, err);
      console.log(result);
      res.json(req.body);
    });
  });
}
