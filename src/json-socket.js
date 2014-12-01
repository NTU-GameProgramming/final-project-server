net = require('net');

var JsonSocket = function(socket) {
	this._socket = socket;
	this._content_length = -1;
	this._buffer = '';
	this._closed = false;

	socket.on('data', this._onData.bind(this));
	socket.on('close', this._onClose.bind(this));
	socket.on('error', this._onError.bind(this));


};

module.exports = JsonSocket;

JsonSocket.prototype = {
	CODE: {
		ERROR_INVALID_CONTENT: 0,
		ERROR_INVALID_CONTENT_LENGTH: 1,
		ERROR_INVALID_JSON: 2
	}, _onData: function(data) {
		console.log('data received: ' + data.toString());
		data = data.toString();
		try {
			this._handleData(data);
		} catch(e) {
			if(e.code == this.CODE.ERROR_INVALID_JSON) {
				this.sendError(e);
			}
		}
	}, _handleData: function(data) {
		this._buffer += data;
		if(this._content_length == -1) { // start of a data
			var i = this._buffer.indexOf('#');
			if(i != -1) {
				var raw_content_length = this._buffer.substring(0,i);
				this._content_length = parseInt(raw_content_length);

				if(isNaN(this._content_length)) {
					this._content_length = -1;
					this._buffer = '';
					var err = new Error('Invalid content length (' + raw_content_length + ') in: ' + this._buffer);
					err.code = this.CODE.ERROR_INVALID_CONTENT_LENGTH;
					throw err;
				}
				this._buffer = this._buffer.substring(i+1);
			}
		}
		if(this._content_length != -1) { // receive raw JSON string data
			if(this._buffer.length == this._content_length) {
				this._handleMessage(this._buffer);
			} else if(this._buffer.length > this._content_length) {
				var message = this._buffer.substring(0, this._content_length);
				var rest = this._buffer.substring(this._content_length);
				this._handleMessage(message);
				this._onData(rest);
			}
		}
	}, _handleMessage: function(data){
		this._content_length = -1;
		this._buffer = '';
		var message;
		try {
			message = JSON.parse(data);
		} catch(e) {
			var err = new Error('Could not parse JSON: ' + e.message + '\nRequest data: ' + data);
			err.code = this.CODE.ERROR_INVALID_JSON;
			throw err;
		}
		console.log('parsed' + message);
		this._socket.emit('message', message);
	}, _onClose: function() {
		this._closed = true;
	}, _onError: function() {
		this._closed = true;
	}, isClosed: function(){
		return this._closed;
	}, sendMessage: function(message, callback) {
		if(this._closed) {
			if(callback) {
				var err = new Error('The socket is closed.');
				err.
				callback(err);
			}
		} else {
			this._socket.write(this._formatMessageData(message), 'utf-8', callback);
		}
	}, sendEndMessage : function(message, callback) {
		var _this = this;
		this.sendMessage(message, function(err) {
			_this.end();
			if(callback) {
				if(err) {
					return callback(err);
				}
				callback();
			}

		});

	}, _formatMessageData: function(message) {
		var messageData = JSON.stringify(message);
		var data = messageData.length + '#' + messageData;
		return data;
	}, _formatError: function(err) {
		return {sucess: false, error: err.toString()};
	}, sendError: function(err) {
		this.sendMessage(this._formatError(err));
	}, sendEndError: function(err) {
		this.sendEndMessage(this._formatError(err));
	}
	
}

// register
delegates = ['on', 'connect', 'end'];
delegates.forEach(function(method){
	JsonSocket.prototype[method] = function() {
			this._socket[method].apply(this._socket, arguments);
	}
});
