Character = function(game_id, game_tree, opts) {
	this._game_id = game_id;
	this._game_tree = game_tree;
	opts = opts || {};
	this._pos = opts.pos || [0.0, 0.0, 0.0];
	this._fdir = opts.fdir || [0.0, 1.0, 0.0];
	this._udir = opts.udir || [0.0, 0.0, 0.0];
	this._motstat = opts.motstat || this.STATE.IDLE;
	this._is_npc = opts.is_npc || false;
	this._blood = 100.0;
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
		this._pos[0] = pos[0];
		this._pos[1] = pos[1];
		this._pos[2] = pos[2];
	}, setFdir: function(fdir) {
		this._fdir[0] = fdir[0];
		this._fdir[1] = fdir[1];
		this._fdir[2] = fdir[2];
	}, setUdir: function(udir) {
		this._udir[0] = udir[0];
		this._udir[1] = udir[1];
		this._udir[2] = udir[2];
	}, setMotStat: function(motstat) {
		this._motstat = motstat;
	}, loseBlood: function(damage) {
		this._blood -= Math.round(damage);
		if(this._blood <= 0 &&  ! this._is_npc) {
			this._game_tree.characterDie(this._game_id);
		}
	}
};
