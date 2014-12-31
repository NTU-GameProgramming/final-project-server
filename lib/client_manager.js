var net = require('net');
var Client = require('./client')

ClientManager = function (game_tree, players) {
	this._game_tree = game_tree;
	this._clients = [];
	this._players = players;
	this._players_ready = 0;
};

module.exports = ClientManager;

ClientManager.prototype = {
	newConnection: function(json_socket) {
		console.log("[ClientManager] New connection from : " + json_socket._socket.remoteAddress + "/" + json_socket._socket.remotePort);
		var new_clientID = this._clients.length;
		var new_client = new Client(this, json_socket, new_clientID, this._game_tree);
		this._clients.push(new_client);
		new_client.initialize();

	}, ready: function() {
		++ this._players_ready;
		if(this._players_ready == this._players) {
			this._finalCall();
		}
	}, _finalCall: function() {
		var total_msg = [];
		// First, add characters

		for(var i=0; i < this._game_tree._characters.length; ++i) {
			var c = this._game_tree._characters[i];
			total_msg.push({
				'TYPE': 'INIT',
				'EVENT': 'ADD_CHARACTER',
				'DATA': {
					'GAME_ID': c._game_id,
					'POS' : c._pos, 
					'FDIR': c._fdir, 
					'UDIR': c._udir
				}
			});
		}

		// Second, add objects
		for(var i=0; i < this._game_tree._objects.length; ++i) {
			var o = this._game_tree._objects[i];
			total_msg.push({
				'TYPE': 'INIT',
				'EVENT': 'ADD_OBJECT',
				'DATA': {
					'GAME_ID': o._game_id,
					'POS' : o._pos, 
					'FDIR': o._fdir, 
					'UDIR': o._udir
				}
			});
		}

		total_msg.push({
			'TYPE': 'INIT',
			'EVENT': 'READY'
		});		
		console.log("[ClientManager] Character Length: " + this._game_tree._characters.length);
		console.log("[ClientManager] Client Length: " + this._clients.length);
		// Finally send json to all clients
		for(var i=0; i < this._clients.length; ++i) {
			for(var j=0; j < total_msg.length; ++j) {
				this._clients[i]._socket.sendMessage(total_msg[j]);
				console.log("[ClientManager] " + JSON.stringify(total_msg[j]));
			}
		}

	}
};
