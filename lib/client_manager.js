var net = require('net');
var Client = require('./client')

ClientManager = function () {
	this._clients = [];
};

module.exports = ClientManager;

ClientManager.prototype = {
	newConnection: function(json_socket) {
		console.log("[ClientManager] New connection.");
		var _clientID = this._clients.length;
		this._clients.push(new Client(json_socket, _clientID, this._game_tree));
		this._clients[this._clients.length-1].initialize();
		//console.log("client_id: " + _clientID);
	}
};
