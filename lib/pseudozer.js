var pseudoLang = require('./pseudoLang');
var _ = require('lodash');

// whitespace + ASCII punctuation code ranges
var BLACKLIST_REGEX = /[\s|\x21-\x2F|\x3A-\x40|\x5B-\x60|\x7B-\x7E]/g;

// translates a string to pseudo-lang
// (eg. "Hello World" --> "Ħëłłø Ŵø®łð")
function translate(str) {
	str = str || '';
	//str = _.escapeRegExp(str);

	return str.replace(/[A-z]/g, function(match) {
		return pseudoLang[match];
	});
}

// surrounds a string with a prefix and suffix
// (eg. "abc" --> "[!!abc!!]")
function surround(str, prefix, suffix) {
	str = str || '';
	prefix = prefix || '[!!';
	suffix = suffix || '!!]';

	return str.replace(/(.*)/, prefix + '$1' + suffix);
}

// extends a string by a percentage of its width
function extend(str, percent) {
	str = str || '';
	percent = percent || 0;

	var blacklisted = getBlacklisted(str);
	var chars = str.split('');

	_.pullAt(chars, _(blacklisted).unzip().first());

	// do stuff with chars

	var length = chars.length;
	var nExtensions = Math.round(length * percent);

	var distribution = getDistribution(nExtensions, length);

	// apply repeat distribution to chars
	chars = _.zipWith(chars, distribution, function(char, n) {
		return repeatChar(char, n);
	});

	return insertBlacklisted(chars, blacklisted).join('');
}

function getBlacklisted(str) {
	var blacklisted = [];
	while(BLACKLIST_REGEX.test(str)) {
		var i = (BLACKLIST_REGEX.lastIndex - 1);
		blacklisted.push([i, str[i]]);
	}
	return blacklisted;
}

// gets an even distribution of repeated characters
// [provide example here]
function getDistribution(nExtensions, length) {
	// fill with initial distribution
	var d0 = _.fill(new Array(length), Math.floor(nExtensions / length));

	// remainder to fill via partition
	var i = nExtensions % length;

	// split distribution into two partitions
	var d1 = _(d0.slice(0,i))
		.map(_.curry(_.add)(1)) // +1 to all elements of first partition
		.value();
	var d2 = d0.slice(i);

	// recombine partitions
	return d1.concat(d2);
}

function repeatChar(char, n) {
	return new Array(n + 2).join(char);
}

function insertBlacklisted(chars, blacklisted) {
	_(blacklisted)
		.forEach(_.spread(function(i, char) {
			chars.splice(i, 0, char);
		}))
		.value();

	return chars;
}

module.exports = {
	translate: translate,
	surround: surround,
	extend: extend,
	getBlacklisted: getBlacklisted,
	getDistribution: getDistribution,
	repeatChar: repeatChar,
	insertBlacklisted: insertBlacklisted,
};
