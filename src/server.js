var fs = require('fs');
var net = require('net');
var JsonSocket = require('./json-socket');
var GameTree = require('./Game/game-tree');
var ClientManager = require('./client_manager');
//var Connector = require('connector')


var port = 8976;


// Create a game
var server = net.createServer();
console.log('This is game server.');
console.log('Initializing game...');
var game_tree = new GameTree();

cm = new ClientManager();


server.on('connection', function(socket) { // socket is a standard net.Socket
    json_socket = new JsonSocket(socket);
	cm.newConnection(json_socket);
/*	json_socket.sendMessage({msg: 'Hello Node.js'}, function(){
		console.log('Data flushed.');
	});*/
});
server.listen(port);
