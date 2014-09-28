var assert    = require('assert'),
    should    = require('should'),
    RegexTrie = require('../lib/regex-trie.js');

describe('#_quotemeta()', function () {

    it('should leave ASCII word-chars unchanged', function () {

        var trie   = new RegexTrie(),
            result = trie._quotemeta('foo');

        result.should.eql('foo');
    });

    it('should return any non-string values', function () {

        var trie    = new RegexTrie(),
            i       = 0,
            objects = [ {}, [], null, undefined, this, true, false ],
            result;

        for ( ; i < objects.length; i++ ) {

            result = trie._quotemeta(objects[i]);

            if ( typeof result === 'undefined' ||
                    ( ! result && typeof result !== 'boolean' ) ) {

                should.not.exist(result);
                continue;
            }
            else {
                objects[i].should.eql(result);
            }
        }
    });

    it('should escape non letter, phrase, or underscore chars', function () {

        var trie   = new RegexTrie(),
            result = trie._quotemeta('^');

        result.should.eql('\\^');
    });

    it('should escape non letter, phrase, or underscore chars', function () {

        var trie     = new RegexTrie(),
            chars    = '^%$#()[]/.,;|',
            result   = trie._quotemeta(chars),
            expected = "\\^%\\$#\\(\\)\\[\\]/\\.,;\\|";

        result.should.eql(expected);

        // Also test that this is a valid RegExp
        try {
            new RegExp(result);
            should.be.ok();
        }
        catch (e) { }
    });

    it('should escape meta chars, leaving non-meta chars alone', function () {

        var trie     = new RegexTrie(),
            regex    = trie.regex(),
            chars    = '^foo|bar|farr$',
            result   = trie._quotemeta(chars),
            expected = '\\^foo\\|bar\\|farr\\$';

        result.should.eql(expected);

        try {
            new RegExp(result);
            should.be.ok();
        }
        catch (e) { }
    });

    it('should be able to cope with lots of brackets', function () {

        var trie     = new RegexTrie(),
            chars    = '[[[[[[[[[[]]]]]]]]]]((()))())(((()))))(()))',
            result   = trie._quotemeta(chars),
            expected = chars
                .split('')
                .map( function (chr) { return '\\' + chr; })
                .join('');

        result.should.eql(expected);

        try {
            new RegExp(result);
            should.be.ok();
        }
        catch (e) { }
    });

    it('should escape simple regex chars', function () {

        var trie     = new RegexTrie(),

            regex    = trie.regex(),
            chars    = 'foo|bar',
            result   = trie._quotemeta(chars),
            expected = 'foo\\|bar';

        result.should.eql(expected);
    });

    it('should escape non-ASCII symbols', function () {

        var trie     = new RegexTrie(),

            regex    = trie.regex(),
            chars    = 'foo\xA9bar',
            result   = trie._quotemeta(chars),
            expected = 'foo\\xA9bar';

        result.should.eql(expected);
    });

    it('should escape astral characters', function () {

        var trie     = new RegexTrie(),

            regex    = trie.regex(),
            chars    = 'foo\uD834\uDF06bar',
            result   = trie._quotemeta(chars),
            expected = 'foo\\uD834\\uDF06bar';

        result.should.eql(expected);
    });

});
