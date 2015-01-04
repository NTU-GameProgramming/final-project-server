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
	for(var i = 0; i < this._npcs; ++i) {
		this.addCharacter(true);
	}

	this._winner_id = -1;
	this._dead_people = 0;
};
module.exports = GameTree;

GameTree.prototype = {
	setTerrian: function(terrian) {
		this._terrian = terrian;
	}, addCharacter: function(is_npc) {
		var game_id = this._characters.length;
		var character = new Character(game_id, this, {
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
	}, characterDie: function(game_id) {
		this._dead_people ++;
	}
};


