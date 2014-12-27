var net = require('net');
var JsonSocket = require('./json-socket');

var Client = function(socket, id, game_tree) {
	console.log("[Client]: constructor");
	this._game_tree = game_tree;
	this._id = id;
	this._socket = socket;
	this._status = Client.prototype.STATUS_CODE.NEWBORN;
	for(var handler_name in this._handlers) {
		this._handlers[handler_name] = this._handlers[handler_name].bind(this);
	}
};

module.exports = Client; 

Client.prototype = {
	STATUS_CODE: {
		NEWBORN: 0,
		INITIALIZE: 1,
		CONNECTED: 2,
		CLOSED: 3,
		OTHER: 4
	}, initialize: function() {
		console.log("[Client]: initialize");
		
		// enter stage	
		this._socket.on('message', this._handlers['initialize']);
	}, _handlers: { // Handlers will be bound to "this" in constructor
		'initialize': function(data) {
			console.log('new json_socket.on is called.');
			console.log('data = ' + JSON.stringify(data));
			if(data['TYPE'] == 'NET' && data['EVENT'] == 'FIRST_CONNECT') {
				console.log("HELLO");
				
				var netinfo = this._socket.address();
				console.log("New connection: " + netinfo.address + "/" + netinfo.port);
				var msg = {'TYPE':'NET', 'EVENT': 'FIRST_CONNECT_ACK', 'CLIENT_ID': this._id};

				this._socket.removeListener('message', this._handlers['initialize']);
				this._socket.on('message', this._handlers['connected']);
				this._socket.sendMessage(msg);
				console.log("MessageSent: " + JSON.stringify(msg));

			} else {
				// Error
				console.log("[Client] Connection failed, close connection.");
				this._socket.end();
				return;
			}
		}, 'connected': function(data) {
			if(data['TYPE'] == 'GAME') {
				if(data['EVENT'] == 'SYNC') {
					var msg = {'TYPE': 'GAME', 'EVENT': 'SYNC_ACK'};
					this._socket.sendMessage(msg);
					console.log("SYNC_ACK sent!");
				}
			}
			//console.log('Now is connected: ' + JSON.stringify(data));
		}
	}
}
