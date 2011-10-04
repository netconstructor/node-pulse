var express = require('express');
var config = require('./config.js');

var servers = config.servers();
var listenPort = config.listenPort();

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Global variable containing all the network timings
var stats = {};

// Routes
app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.get('/servers', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  for(var i in servers){
    res.write(servers[i]+'\n');
  }
  res.end();
});

app.get('/echo/:echo', function(req, res){
  res.write(req.params.echo);
  res.end();
});

app.listen(listenPort);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


setInterval(function(){
  console.log("Gathering timing data");
  
  
  
}, 30000);

