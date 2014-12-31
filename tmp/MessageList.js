


var root = {};
var Generate = function (list) {
	for(var i=0; i<list.length; ++i) {
		root[list[i]]
	}
}


var MessageList = {
	'INIT': [
		'FIRST_CONNECT',
		'FIRST_CONNECT_ACK',
		'READY',
		'ADD_CHARACTER',
		'ADD_OBJECT'
	],

	'GAME': [
		'UPDATE_CHARACTER',
		'UPDATE_OBJECT'
	]
};
