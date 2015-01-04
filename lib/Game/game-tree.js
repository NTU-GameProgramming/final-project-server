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
	this._npcs = opts.npcs || 0;

	this._initialize();
};
module.exports = GameTree;

GameTree.prototype = {
	_initialize: function() {
		for(var i = 0; i < this._npcs; ++i) {
			this.addCharacter(true);
		}
	}, setTerrian: function(terrian) {
		this._terrian = terrian;
	}, addCharacter: function(is_npc) {
		var game_id = this._characters.length;
		var character = new Character(game_id, {
			pos: [
				3569.0,// + (Math.random() * 1000.0 - 500.0),
				-3108 + game_id * (-500),
				0
			],
			is_npc: is_npc
		});
		this._characters.push(character);
		return character;
	}, addObject: function(object) {
		this._objects.push(object);
	}
};


