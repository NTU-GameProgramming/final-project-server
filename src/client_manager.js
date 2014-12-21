var net = require('net');

ClientManager = function () {
	this.clients = [];
};

module.exports = ClientManager;

ClientManager.prototype = {
	newConnection: function(json_socket) {
		this.clients.push({socket: json_socket, confirm_flag: false});

        var _thisCM = this;
		var _clientID = this.clients.length-1;
		console.log("client_id: " + _clientID);
		json_socket.on('message', function(data) {
			console.log('new json_socket.on is called.');
			console.log('data = ' + JSON.stringify(data));
			if(data['typ'] == 'net' && data['evt'] == 'FIRST_CONNECT') {

				var netinfo = this.address();
				console.log("A new connection is received. " + netinfo.address + "/" + netinfo.port);

				json_socket.sendMessage({'typ':'net', 'evt': 'FIRST_CONNECT', 'client_id': _clientID});

			}

			// enter stage
			this.on('message', _thisCM.normalConnection);
		});
	}, normalConnection: function(data) {
		console.log("Data received: " + data.toString());
	}
};
