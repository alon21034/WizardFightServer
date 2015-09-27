
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();
var io = require('socket.io')(app);

// This should be put in another file
var Game = function() {
	console.log("create game instance");
	this.fighter_list = [];
}

Game.prototype.addFighter = function(f) {
	this.fighter_list.push(f);
}

Game.prototype.getJSON = function() {
	ret = {};
	temp = [];
	for (var i = 0 ; i < this.fighter_list.length ; ++i) {
		temp.push(this.fighter_list[i].toString());
	}
	ret['fighter_list'] = temp;
	return ret;
}

var Fighter = function(x, y) {
	this.x = x;
	this.y = y;
}

Fighter.prototype.move = function(x, y) {
	if (this.x > x) {
		this.x -= 5;
	} else if (this.x < x) {
		this.x += 5;
	}
	if (this.y > y) {
		this.y -= 5;
	} else if (this.y < y) {
		this.y += 5;
	}
}

Fighter.prototype.toString = function() {
	ret = {};
	ret['x'] = this.x;
	ret['y'] = this.y;
	return ret;
}

game = new Game();
fighter = new Fighter(10, 20);
game.addFighter(fighter);

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

app.get('/', routes.index);

app.get('/room', function(req, res) {

});


app.listen(process.env.PORT || 5000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

io.on('connection', function(socket) {
  socket.emit('initial', {hello: 'world'});
  socket.on('start', function(data) {
    console.log('socket.on:start')
    console.log(data);
  });
  socket.on('update', function(data) {
  	console.log(game.getJSON());
  	//socket.emit('game_data', game.getJSON());
  });
})