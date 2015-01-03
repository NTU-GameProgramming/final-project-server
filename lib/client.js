var JsonSocket = require('./json-socket');

var Client = function(client_manager, socket, id, game_tree) {
	console.log("[Client]: constructor , add: " + socket._socket.remoteAddress + "/" + socket._socket.remotePort);
	this._game_tree = game_tree;
	this._id = id;
	this._socket = socket;
	this._character = null;
	this._status = Client.prototype.STATUS_CODE.NEWBORN;
	this._handlers = {};
	for(var handler_name in this._raw_handlers) {
		this._handlers[handler_name] = this._raw_handlers[handler_name].bind(this);
	}

	this._client_manager = client_manager;
	this._netinfo = {
		address: this._socket._socket.remoteAddress,
		port: this._socket._socket.remotePort
	};

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
	}, _raw_handlers: { // Handlers will be bound to "this" in constructor
		'initialize': function(data) {
			console.log('data = ' + JSON.stringify(data));
			if(data[0] == 'INIT' && data[1] == 'FIRST_CONNECT') {
				
				console.log("[Client] New connection: " + this._netinfo.address + "/" + this._netinfo.port + ", client_id:" + this._id);
				// Assign a character
				this._character = this._game_tree.addCharacter();

				var msg = [
					'INIT',
				   	'FIRST_CONNECT_ACK',
					{
						'CLIENT_ID': this._id,
					   	'GAME_ID': this._character._game_id
					}
				];

				this._socket.removeListener('message', this._handlers['initialize']);
				this._socket.on('message', this._handlers['connected']);
				this._socket.sendMessage(msg);
				console.log("[Client] MessageSent: " + JSON.stringify(msg));
				this._client_manager.ready(this._id);
			} else {
				// Error
				console.log("[Client] Connection failed, close connection.");
				this._socket.end();
				return;
			}
		}, 'connected': function(data) {
			//console.log("Connected: " + this._netinfo.address + "/" + this._netinfo.port + ", client_id:" + this._id);
//			console.log("[Client] " + JSON.stringify(data));
			if(data[0] == 'GAME') {
				var evt = data[1];
				if(evt == 'SYNC') {
					var msg = ['GAME', 'SYNC_ACK'];
					this._socket.sendMessage(msg);
					console.log("SYNC_ACK sent!");
				} else if(evt == 'UPDATE_CHARACTER') {
					try{
					var game_id = data[2]['GAME_ID'];
					var pos = data[2]['POS'];
					var msg = [
						'GAME',
						'UPDATE_CHARACTER',
						{
							'GAME_ID': game_id,
							'POS': pos
						}
					];
					console.log(JSON.stringify(msg));
					this._character.setPos(pos);
					this._client_manager.broadcast(msg, this._id);
					} catch(e) {console.log(e.message)}
				} else if(evt == 'UPDATE_CHARACTER_DIRECTION') {
					try{
					var game_id = data[2]['GAME_ID'];
					var pos = data[2]['POS'];
					var fdir = data[2]['FDIR'];
					var udir = data[2]['UDIR'];
					var msg = [
						'GAME',
						'UPDATE_CHARACTER_DIRECTION',
						{
							'GAME_ID': game_id,
							'FDIR': fdir,
							'UDIR': udir
						}
					];
					console.log(JSON.stringify(msg));
					if(fdir != null) { this._character.setFdir(fdir); }
					if(udir != null) { this._character.setUdir(udir); }
					this._client_manager.broadcast(msg, this._id);
					} catch(e) {console.log(e.message)}
				} else if(evt == 'UPDATE_MOTION_STATE') {
					var game_id = data[2]['GAME_ID'];
					var motstat = data[2]['MOTION_STATE'];
					var msg = [
						'GAME',
						'UPDATE_MOTION_STATE',
						{
							'GAME_ID': game_id,
							'MOTION_STATE': motstat
						}
					];
					this._character.setMotStat(motstat);
					this._client_manager.broadcast(msg, this._id);
					console.log(JSON.stringify(msg));
				} else if(evt == 'UPDATE_ATTACK') {

					this._client_manager.broadcast(data, this._id);
				}
			}
			//console.log('Now is connected: ' + JSON.stringify(data));
		}
	}
}
