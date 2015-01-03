var net = require('net');
var JsonSocket = require('./lib/json-socket');
var GameTree = require('./lib/Game/game-tree');
var ClientManager = require('./lib/client-manager');
var FightSystem = require('./lib/Game/fight-system');

var port = 8976;
for(var key in process.argv) {
	console.log("process.argv[" + key + "] = " + process.argv[key]);
}

var players = process.argv[2] || "2";
players = parseInt(players,10);

// Create a game
var server = net.createServer();
var game_tree = new GameTree();
var fight_system = new FightSystem(game_tree, 500.0, 15.0, 20.0);
cm = new ClientManager(game_tree, fight_system, players);

server.on('connection', function(socket) { // socket is a standard net.Socket
	console.log("[Server] Got connection.");
    json_socket = new JsonSocket(socket);
	cm.newConnection(json_socket);
/*	json_socket.sendMessage({msg: 'Hello Node.js'}, function(){
		console.log('Data flushed.');
	});*/
});

console.log('This is game server for NTU-Game_Programming-2014 Fall');
console.log('Port: '+ port);
console.log('Players: ' + players);
server.listen(port);
