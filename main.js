var psuedoMap = require('./psuedoMap');
var seedrandom = require('seedrandom');

var PUNCTUATION_REGEX = /[\x21-\x2F|\x3A-\x40|\x5B-\x60|\x7B-\x7E]/; // ASCII punctuation code ranges
var HTML_TAG_REGEX = /<[a-z][\s\S]*>/g;
var WHITESPACE_REGEX = /\s/;

// checks to see if a string has at least one HTML tag
function containsHTMLTag(str) {
	return HTML_TAG_REGEX.test(str)
}

function containsWhitespace(str) {
	return WHITESPACE_REGEX.test(str);
}

function containsPunctuation(str) {
	return PUNCTUATION_REGEX.test(str);
}

function getLength(str) {
	return str.replace(WHITESPACE_REGEX, '').replace(PUNCTUATION_REGEX, '').length;
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

function extend(str, percent) {
	// length sans whitespace and punctuation
	var length = getLength(str);

	if (length < 1) {
		return str;
	}

	var rng = seedrandom(length);

	// number of characters to duplicate
	var duplicateN = Math.round(length * (1 + percent)) - length;

	var chars = str.split('');

	while (duplicateN > 0) {
		var randomIndex = Math.floor(rng() * chars.length);
		var char = chars[randomIndex];

		// don't duplicate whitespace or punctuation
		if (containsWhitespace(char) || containsPunctuation(char)) {
			continue;
		}

		chars.splice(randomIndex, 0, char);
		duplicateN--;
	}

	return chars.join('');
}
