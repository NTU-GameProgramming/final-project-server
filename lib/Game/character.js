Character = function(game_id, opts) {
	this._game_id = game_id;

	opts = opts || {};
	this._pos = opts.pos || [0.0, 0.0, 0.0];
	this._fdir = opts.fdir || [0.0, 1.0, 0.0];
	this._udir = opts.udir || [0.0, 0.0, 0.0];
	this._stat = opts.stat || this.STATE.IDLE;
};

module.exports = Character;

Character.prototype = {
	STATE: {
		IDLE : 0,
		RUN  : 1,
		ATK  : 2,
		DWN  : 3
	}, setStat: function(stat){
		this._stat = stat;
	}, setPos: function(pos) {
		this._pos = pos;
	}, setFdir: function(fdir) {
		this._fdir = fdir;
	}
};
