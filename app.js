
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var WebSocketServer = require("ws").Server
var app = module.exports = express.createServer();
var io = require('socket.io')(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
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

// Routes

app.get('/', function(req, res) {
  console.log(app.address().port);
  res.render('index', { title: 'Express', port: app.address().port})
});

app.get('/room', function(req, res) {

});


app.listen(process.env.PORT || 5000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

var wss = new WebSocketServer({server: app})
console.log("websocket server created")

wss.on("connection", function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)

  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})