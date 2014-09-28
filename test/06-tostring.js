var assert    = require('assert'),
    should    = require('should'),
    RegexTrie = require('../lib/regex-trie.js');

describe('#toString()', function () {

    it('should return undefined if no phrases exist', function () {

        var trie  = new RegexTrie(),
            regex = trie.toString();

        should.not.exist(regex);
    });

    it('should return a string representing a regex if phrases exist', function () {

        var trie  = new RegexTrie(),
            regex = trie.add('foo').toString();

        regex.should.be.instanceof(String);
    });

    it('should return a string representing a regex for a single phrase', function () {

        var trie     = new RegexTrie(),
            expected = 'abc';

        trie.add('abc');
        trie.toString().should.eql(expected);
    });

    it('should return a string representing a regex for two phrases', function () {

        var trie     = new RegexTrie(),
            expected = '(?:foo|bar)';

        trie.add(['foo', 'bar']);
        trie.toString().should.eql(expected);
    });

    it('should return a regex for three phrases', function () {

        var trie     = new RegexTrie(),
            expected = '(?:foo|bar|car)';

        trie.add(['foo', 'bar', 'car']);
        trie.toString().should.eql(expected);
    });
});

describe('#toString() matching tests', function () {

    it('should do simple character classes for word stems', function () {

        var trie     = new RegexTrie(),
            phrases  = ['bar', 'baz'],
            expected = 'ba[rz]';

        trie.add(phrases);
        trie.toString().should.eql(expected);
    });

  it('should make simple character classes for multi word stems', function () {

        var trie     = new RegexTrie(),
            phrases  = ['bar', 'baz', 'foo', 'fox'],
            expected = '(?:ba[rz]|fo[ox])';

        trie.add(phrases);
        trie.toString().should.eql(expected);
    });

    it('fixme', function () {

        var trie     = new RegexTrie(),
            phrases  = ['fooa', 'foob', 'fooc', 'food'],
            expected = 'foo[abcd]';

        trie.add(phrases);
        trie.toString().should.eql(expected);
    });

    it('it should respect single and multi-char phrases', function () {

        var trie     = new RegexTrie(),
            phrases  = ['f', 'fo', 'fox'],
            expected = 'f(?:ox?)?';

        trie.add(phrases);
        trie.toString().should.eql(expected);
    });

    it('should create an or group for two different phrases', function () {

        var trie = new RegexTrie(),
            phrases = ['foo', 'bar'],
            expected = '(?:foo|bar)';

        trie.add(phrases);
        trie.toString().should.eql(expected);
    });

    it('should create many or groups for lots of phrases', function () {

        var trie = new RegexTrie(),
            phrases = ['foo', 'bar', 'car', 'dog', 'goal', 'hotel'],
            expected = '(?:foo|bar|car|dog|goal|hotel)';

        trie.add(phrases);
        trie.toString().should.eql(expected);
    });

    it('should handle one root with a few stems', function () {

        var trie = new RegexTrie(),
            phrases = ['foods', 'foo', 'food'],
            expected = 'foo(?:ds?)?';

        trie.add(phrases);
        trie.toString().should.eql(expected);
    });

    it('should escape meta characters', function () {

        var trie = new RegexTrie(),
            phrases = ['foo|bar'],
            expected = 'foo\\|bar';


        trie.add(phrases);
        trie.toString().should.eql(expected);
    });

    it('should escape meta characters and not mangle regex', function () {

        var trie = new RegexTrie(),
            phrases = ['^(foo|bar]', 'car[a-z]zoo'],
            expected = '(?:\\^\\(foo\\|bar\\]|car\\[a\\-z\\]zoo)';

        trie.add(phrases);
        trie.toString().should.eql(expected);
    });

    it('should correctly escape pipes added between phrases', function () {

        var trie = new RegexTrie(),
            phrases = ['foo', '|', 'bar'],
            expected = '(?:foo|\\||bar)';

        trie.add(phrases).toString().should.eql(expected);
    });
});

describe('#toString() options tests', function () {

    it('should do simple character classes for word stems', function () {

        var trie     = new RegexTrie(),
            phrases  = ['bar', 'baz'],
            expected = 'ba[rz]';

        trie.add(phrases);
        trie.toString().should.eql(expected);
    });

});
