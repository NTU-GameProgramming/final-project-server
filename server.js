var fs = require('fs');
var net = require('net');
var JsonSocket = require('./lib/json-socket');
var GameTree = require('./lib/Game/game-tree');
var ClientManager = require('./lib/client_manager');
//var Connector = require('connector')


var port = 8976;


// Create a game
var server = net.createServer();
console.log('This is game server for NTU-Game_Programming-2014 Fall');
var game_tree = new GameTree();

cm = new ClientManager();


server.on('connection', function(socket) { // socket is a standard net.Socket
	console.log("[Server] Got connection.");
    json_socket = new JsonSocket(socket);
	cm.newConnection(json_socket);
/*	json_socket.sendMessage({msg: 'Hello Node.js'}, function(){
		console.log('Data flushed.');
	});*/
});
server.listen(port);
