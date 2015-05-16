var psuedoMap = require('./psuedoMap');
var _ = require('lodash');

var BLACKLIST_REGEX = /[\s|\x21-\x2F|\x3A-\x40|\x5B-\x60|\x7B-\x7E]/g; // ASCII punctuation code ranges

var HTML_TAG_REGEX = /<[a-z][\s\S]*>/g;

// checks to see if a string has at least one HTML tag
function containsHTMLTag(str) {
	return HTML_TAG_REGEX.test(str);
}

// translates a string to psuedo-lang
// (eg. "Hello World" --> "Ħëłłø Ŵø®łð")
function psuedoTranslate(str) {
	return str.replace(/[A-z]/g, function(match) {
		return psuedoMap[match];
	});
}

// surrounds a string with a prefix and suffix
// (eg. "abc" --> "[!!abc!!]")
function surround(str, prefix, suffix) {
	return str.replace(/(.*)/, prefix + '$1' + suffix);
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

function extend(str, percent) {
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

function insertBlacklisted(chars, blacklisted) {
	_(blacklisted)
		.forEach(_.spread(function(i, char) {
			chars.splice(i, 0, char);
		}))
		.value();

	return chars;
}

var str = 'abc!';

var x = extend(str, 0.5);

// HOLY SHIT, IT WORKS!!!!
console.log(x);
