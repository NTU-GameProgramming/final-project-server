var net = require('net');
var JsonSocket = require('./json-socket');

var host = 'localhost';
var port = 8976;
var socket = new JsonSocket(new net.Socket());

console.log('This is client');
socket.on('connect', function() {
	socket.on('message', function(message) {
		console.log('#Receive data: ' + data.toString());
	});
	socket.sendMessage({msg: 'This is client.'}, function(){
		console.log('Data flushed.');
	});


});
socket.connect(port, host);

