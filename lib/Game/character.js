




function Character = function() {
	this.pos = [0.0, 0.0, 0.0];
	this.fdir = [0.0, 0.0, 0.0];
	this.stat=this.STATE.IDLE;
}
module.exports = Character;

Character.prototype = {
	STATE: {
		IDLE : 0,
		RUN  : 1,
		ATK  : 2,
		DWN  : 3
	}, setStat: function(stat){
	}, setPos: function(pos) {
		this.pos = pos;
	}, setFdir: function(fdir) {
		this.fdir = fdir;
	}
};
