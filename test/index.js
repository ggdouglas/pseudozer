var should = require('chai').should();
var pseudozer = require('../lib/pseudozer');

var translate = pseudozer.translate;
var extend = pseudozer.extend;
var surround = pseudozer.surround;

describe('#translate', function() {

	it('translates a word', function() {
		translate('Hello').should.equal('Ħëłłø');
	});

	it('translates a simple string', function() {
		translate('¡Hello World!').should.equal('¡Ħëłłø Ŵø®łð!');
	});

	it('is idempotent', function() {
		var translated = translate('Hello World!');
		translate(translated).should.equal('Ħëłłø Ŵø®łð!');
	});

	it('ignores whitespace', function() {
		translate('   	').should.equal('   	');
	});

	// TODO: regex or input needs to be escaped
	xit('ignores punctuation', function() {
		translate('!"#$%&()*+,-./:;<=>?@[]^_`{|}~').should.equal('!"#$%&()*+,-./:;<=>?@[]^_`{|}~');
	});

	it('returns empty for falsy values', function() {
		translate('').should.equal('');
		translate().should.equal('');
		translate(null).should.equal('');
	});
});

describe('#extend', function() {

	it('extends nothing by default', function() {
		extend('Hello').should.equal('Hello');
	});

	it('extends nothing explicitly', function() {
		extend('Hello', 0).should.equal('Hello');
	});

	it('extends a string by 10%', function() {
		extend('Hello', 0.1).should.equal('HHello');
	});

	it('extends a string by 30%', function() {
		extend('Hello', 0.3).should.equal('HHeello');
	});

	it('extends a string by 50%', function() {
		extend('Hello', 0.5).should.equal('HHeelllo');
	});

	it('extends a string by 100%', function() {
		extend('Hello', 1.0).should.equal('HHeelllloo');
	});

	it('extends a string by 200%', function() {
		extend('Hello', 2.0).should.equal('HHHeeellllllooo');
	});

	it('extends a string twice', function() {
		var extended = extend('Hello', 0.5);
		extend(extended, 0.5).should.equal('HHHHeeeelllo');
	});

	it('extends a translated string', function() {
		extend('Ħëłłø', 0.5).should.equal('ĦĦëëłłłø');
	});

	it('ignores whitespace', function() {
		extend('   	', 0.5).should.equal('   	');
	});

	it('ignores punctuation', function() {
		extend('!"#$%&()*+,-./:;<=>?@[]^_`{|}~', 0.5).should.equal('!"#$%&()*+,-./:;<=>?@[]^_`{|}~');
	});

	it('returns empty for falsy values', function() {
		extend('', 0.5).should.equal('');
		extend('').should.equal('');
		extend().should.equal('');
		extend(null).should.equal('');
	});
});

describe('#surround', function() {
	it('surrounds a word in the default prefix/suffix', function() {
		surround('Hello').should.equal('[!!Hello!!]');
	});

	it('surrounds a simple string in the default prefix/suffix', function() {
		surround('¡Hello World!').should.equal('[!!¡Hello World!!!]');
	});

	it('surrounds a translated string in the default prefix/suffix', function() {
		surround('¡Ħëłłø Ŵø®łð!').should.equal('[!!¡Ħëłłø Ŵø®łð!!!]');
	});

	it('surrounds a word in a custom prefix/suffix', function() {
		surround('Hello', '[## ', ' ##]').should.equal('[## Hello ##]');
	});
});
