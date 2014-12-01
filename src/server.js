var net = require('net');
var JsonSocket = require('./json-socket');
var fs = require('fs');

//var cm = require('clientManager');
//var Connector = require('connector')


var port = 8976;


var server = net.createServer();
console.log('This is Server.');
server.on('connection', function(socket) { // socket is a standard net.Socket
    socket = new JsonSocket(socket);
    socket.on('message', function(data) {
		console.log('#Receive data: ' + data.toString());
	});

/*	socket.sendMessage({msg: 'Hello Node.js'}, function(err){
		console.log('Error' + err.message);
	});*/
});

server.listen(port);
