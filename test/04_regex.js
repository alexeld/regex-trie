var assert    = require('assert'),
    should    = require('should'),
    RegexTrie = require('../lib/regex-trie.js');

describe('#regex()', function () {

    it('should return undefined if no phrases exist', function () {

        var trie  = new RegexTrie(),
            regex = trie.regex();

        should.not.exist(regex);
    });

    it('should return a RegExp object if phrases exist', function () {

        var trie  = new RegexTrie(),
            regex = trie.add('foo').regex();

        regex.should.be.instanceof(RegExp);
    });

    it('should return a regex for a single phrase', function () {

        var trie     = new RegexTrie(),
            expected = new RegExp('abc');

        trie.add('abc');
        trie.regex().should.eql(expected);
    });

    it('should return a regex for two phrases', function () {

        var trie     = new RegexTrie(),
            expected = new RegExp('(?:foo|bar)');

        trie.add(['foo', 'bar']);
        trie.regex().should.eql(expected);
    });

    it('should return a regex for three phrases', function () {

        var trie     = new RegexTrie(),
            expected = new RegExp('(?:foo|bar|car)');

        trie.add(['foo', 'bar', 'car']);
        trie.regex().should.eql(expected);
    });
});

describe('#regex() matching tests', function () {

    it('should do simple character classes for word stems', function () {

        var trie     = new RegexTrie(),
            phrases  = ['bar', 'baz'],
            do_not_match = ['ba', 'batman'],
            expected = new RegExp('ba[rz]');

        trie.add(phrases);
        trie.regex().should.eql(expected);
        phrases.should.match(expected);
        do_not_match.should.not.match(expected);
    });

  it('should make simple character classes for multi word stems', function () {

        var trie     = new RegexTrie(),
            phrases  = ['bar', 'baz', 'foo', 'fox'],
            do_not_match = ['ba', 'batman', 'fo', 'foox'],
            expected = new RegExp('(?:ba[rz]|fo[ox])');

        trie.add(phrases);
        trie.regex().should.eql(expected);
        phrases.should.match(expected);
        do_not_match.should.not.match(expected);
    });

    it('fixme', function () {

        var trie     = new RegexTrie(),
            phrases  = ['fooa', 'foob', 'fooc', 'food'],
            do_not_match = ['ba', 'batman', 'fo', 'foox'],
            expected = new RegExp('foo[abcd]');

        trie.add(phrases);
        trie.regex().should.eql(expected);
        phrases.should.match(expected);
        do_not_match.should.not.match(expected);
    });

    it('it should respect single and multi-char phrases', function () {

        var trie     = new RegexTrie(),
            phrases  = ['f', 'fo', 'fox'],
            do_not_match = ['fa', 'ox'],
            expected = new RegExp('f(?:ox?)?');

        trie.add(phrases);
        trie.regex().should.eql(expected);
        phrases.should.match(expected);
        do_not_match.should.not.match(expected);
    });

    it('should create an or group for two different phrases', function () {

        var trie = new RegexTrie(),
            phrases = ['foo', 'bar'],
            do_not_match = ['fo', 'ba'],
            expected = new RegExp('(?:foo|bar)');

        trie.add(phrases);
        trie.regex().should.eql(expected);
        phrases.should.match(expected);
        do_not_match.should.not.match(expected);
    });

    it('should create many or groups for lots of phrases', function () {

        var trie = new RegexTrie(),
            phrases = ['foo', 'bar', 'car', 'dog', 'goal', 'hotel'],
            do_not_match = ['fo', 'ba', 'cat', 'snake', 'goat', 'hotal'],
            expected = new RegExp('(?:foo|bar|car|dog|goal|hotel)');

        trie.add(phrases);
        trie.regex().should.eql(expected);
        phrases.should.match(expected);
        do_not_match.should.not.match(expected);
    });

    it('should handle one root with a few stems', function () {

        var trie = new RegexTrie(),
            phrases = ['foods', 'foo', 'food'],
            do_not_match = ['fod', 'foood', 'fds'],
            expected = new RegExp('foo(?:ds?)?');

        trie.add(phrases);
        trie.regex().should.eql(expected);
        phrases.should.match(expected);
        do_not_match.should.not.match(expected);
    });

    it('should escape meta characters', function () {

        var trie = new RegexTrie(),
            phrases = ['foo|bar'],
            do_not_match = ['foo', 'bar'],
            expected = new RegExp('foo\\|bar');


        trie.add(phrases);
        trie.regex().should.eql(expected);
        phrases.should.match(expected);
        do_not_match.should.not.match(expected);
    });

    it('should escape meta characters and not mangle regex', function () {

        var trie = new RegexTrie(),
            phrases = ['^(foo|bar]', 'car[a-z]zoo'],
            do_not_match = ['foo', 'bar', 'foo|bar', 'cargzoo'],
            expected = new RegExp('(?:\\^\\(foo\\|bar\\]|car\\[a\\-z\\]zoo)');

        trie.add(phrases);
        trie.regex().should.eql(expected);
        phrases.should.match(expected);
        do_not_match.should.not.match(expected);
    });
});

describe('#regex() options tests', function () {

    it('should do simple character classes for word stems', function () {

        var trie     = new RegexTrie(),
            phrases  = ['bar', 'baz'],
            do_not_match = ['ba', 'batman'],
            expected = new RegExp('ba[rz]');

        trie.add(phrases);
        trie.regex().should.eql(expected);
        phrases.should.match(expected);
        do_not_match.should.not.match(expected);
    });

});
