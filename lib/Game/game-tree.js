var net = require('net');
var fs = require('fs');
var JsonSocket = require('../json-socket');
var Terrian = require('./terrian');

GameTree = function(opts) {
	this.terrian = new Terrian();
	this.characters = [];
	this.objects = [];
};
module.exports = GameTree;

GameTree.prototype = {
	setTerrian: function(terrian) {
		this.terrian = terrian;
	}, addCharacter: function(character) {
		this.characters.push(character);
	}, addObject: function(object) {
		this.objects.push(object);
	}

};


