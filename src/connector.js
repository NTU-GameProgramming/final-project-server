var https = require('https');
var fs = require('fs');

Connector = function(opts) {
	opts = opts || {};
	
}

https.createServer(options, function (req, res) {
	  res.writeHead(200);
	    res.end("hello world\n");
}).listen(8000);

module.exports = Connector;
