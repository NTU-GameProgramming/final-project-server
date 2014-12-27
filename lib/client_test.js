var net = require('net');
var JsonSocket = require('./json-socket');

var host = 'localhost';
var port = 8976;
var json_socket = new JsonSocket(new net.Socket());

console.log('This is client');
var client_id = -1;
json_socket.on('message', function(data) {
	console.log('new json_socket.on is called.');
	if(data['typ'] == 'net' && data['evt'] == 'FIRST_CONNECT') {
		client_id = data['client_id'];
		console.log('client_id : ' + client_id);
	}

	json_socket.on('message', function(data){
	console.log("Data received: " + data.toString());
	});
});

json_socket.on('connect', function() {
	json_socket.sendMessage({'typ': 'net', 'evt': 'FIRST_CONNECT'});
});
json_socket.connect(port, host);

