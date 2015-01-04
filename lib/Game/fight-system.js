
var FightSystem = function (game_tree, r, angle, attack_power) { // angle in degree
	this._game_tree = game_tree;
	this._rr = r * r;
	this._critical_cos = Math.cos(angle * Math.PI / 180.0);
	this._attack_power = attack_power;
};

module.exports = FightSystem;

FightSystem.prototype = {
	attack: function(attacker) {
		var char_list = this._game_tree._characters;
		var damage = [];
		for(var i=0; i < char_list.length; ++i) {
			if(char_list[i]._game_id != attacker._game_id) {
				damage.push(this._judgeAttack(attacker, char_list[i]));
			} else {
				damage.push(0);
			}
		}
		return damage;
	}, _judgeAttack: function(attack_char, other_char) {
		var disp = [other_char._pos[0] - attack_char._pos[0],
		            other_char._pos[1] - attack_char._pos[1],
		            other_char._pos[2] - attack_char._pos[2]];
		var dist2 = Math.pow(disp[0], 2) + Math.pow(disp[1], 2) + Math.pow(disp[2], 2);
		
		if(dist2 < this._rr) {
			var dist = Math.sqrt(dist2);

			var cos_val = (attack_char._fdir[0] * disp[0] + attack_char._fdir[1] * disp[1] + attack_char._fdir[2] * disp[2]) / dist;
			if(cos_val > this._critical_cos) {
				return this._attack_power * cos_val;
			}
		}

		return 0;
	}
}

