var pseudozer = require('./lib/pseudozer');
var _ = require('lodash');

module.exports = {
	str: function(str) {
		return _.flow(
			pseudozer.translate,
			pseudozer.extend,
			pseudozer.surround
		)(str);
	},

	translate: pseudozer.translate,
	extend: pseudozer.extend,
	surround: pseudozer.surround
};
