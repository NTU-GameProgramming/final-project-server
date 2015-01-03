var net = require('net');
var fs = require('fs');
var JsonSocket = require('../json-socket');
var Terrian = require('./terrian');
var Character = require('./character');

GameTree = function(opts) {
	opts = opts || {};
	this._terrian = new Terrian();
	this._characters = [];
	this._objects = [];
	this._ready = false;
	this._rr = opts.rr || 50.0 * 50.0;
};
module.exports = GameTree;

GameTree.prototype = {
	setTerrian: function(terrian) {
		this._terrian = terrian;
	}, addCharacter: function() {
		var game_id = this._characters.length;
		var character = new Character(game_id, {
			pos: [3569.0, -3108 + game_id * (-200), 0]
		});
		this._characters.push(character);
		return character;
	}, addObject: function(object) {
		this._objects.push(object);
	}
};


