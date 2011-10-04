var express = require('express');
var http = require('http');
var microtime = require('microtime');
var config = require('./config.js');

var servers = config.servers();

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

app.get('/stats', function(req, res){
  res.render('stats', {
    title: 'Stats',
    stats: stats,
    servers: servers,
    now: Math.round(microtime.nowDouble())
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
  console.log((new Date()) + " "+req.connection.remoteAddress+" "+req.params.echo);
  res.write(req.params.echo);
  res.end();
});

app.post('/collect', function(req, res){
  console.log('/collect');
  var data = '';
  req.addListener('data', function(chunk){ 
    data += chunk; 
  });
  req.addListener('end', function(){
    console.log(data);
    var timings = JSON.parse(data);
    stats[timings.self] = timings.stats;
  });
});

app.listen(config.port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
console.log("Server: "+config.self);

setInterval(function(){

  var startTime = microtime.nowDouble();
  console.log("Gathering timing data at "+startTime);
  
  for(var i in servers){
    if(i != config.self) { 
      console.log('\t'+i+'/'+servers[i]);
      (function(){
        var hostname = servers[i];
        var servername = i;
        var req = http.request({
          host: hostname,
          port: config.port,
          path: "/echo/hi",
          method: "GET",
          headers: {'Connection': 'close'}
        });
        req.on('error', function(e) {
          console.log('\t['+servername+'/'+hostname+'] Error: '+e.message);
        });
        req.on('response', function(res){
          clearTimeout(timeout);
          var ms = Math.round((microtime.nowDouble()-startTime)*1000);
          
          // Store the result in the stats object
          if(typeof stats[config.self] == "undefined"){
            stats[config.self] = {};
          }
          stats[config.self][servername] = {ms: ms, date: Math.round(microtime.nowDouble())};
          
          console.log('\t['+servername+'/'+hostname+'] Duration: '+ms);
        });
        
        var timeout = setTimeout(function(){
          req.removeAllListeners('response');
          var ms = Math.round((microtime.nowDouble()-startTime)*1000);
          console.log('\t['+servername+'/'+hostname+'] Timed out after: '+ms);
  
          if(typeof stats[config.self] == "undefined"){
            stats[config.self] = {};
          }
          stats[config.self][servername] = {ms: -1, date: Math.round(microtime.nowDouble())};
          
        }, 5000);
        
        req.end();
      })();
    }
  }
  
}, config.pingInterval);

setTimeout(function(){
  setInterval(function(){
    console.log('Sending stats to servers...');
    for(var i in servers){
      if(i != config.self) {
        console.log('\t'+i+'/'+servers[i]);
        (function(){
          var postbody = JSON.stringify({
            self: config.self,
            stats: stats[config.self]
          });
        
          var hostname = servers[i];
          var servername = i;
          var req = http.request({
            host: hostname,
            port: config.port,
            path: "/collect",
            method: "POST",
            headers: {
              'Content-type': 'text/json',
              'Content-length': postbody.length
            }
          });
          req.on('error', function(e) {
            console.log('\t['+servername+'/'+hostname+'] Error sending stats: '+e.message);
          });
          console.log('\tPost body: '+postbody);
          req.write(postbody);
          req.end();
        })();
      }
    }
  }, config.postInterval);
}, 1000); // give the gather function a 1-second head start

