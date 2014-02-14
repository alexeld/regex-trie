var assert    = require('assert'),
    should    = require('should'),
    RegexTrie = require('../lib/regex-trie.js');

describe('#contains()', function () {

    it('should return undefined when no keys in trie', function () {

        var trie = new RegexTrie();
        trie.contains('foo').should.equal(false);
    });

    it('should return undefined when called with bad arguments', function () {

        var trie       = new RegexTrie(),
            bad_inputs = [ 
                [], 
                {}, 
                true, 
                false, 
                null, 
                undefined, 
                this, 
                NaN, 
                /foo|bar/ 
            ];

        bad_inputs.forEach( function (input) {
            trie.contains(input).should.equal(false);
        });
    });

    it('should return a value if entered', function () {

        var trie = new RegexTrie();

        trie.add('alpha');
        trie.contains('alpha').should.equal(true);
    });

    it('should return false if the phrase does not exist', function () {

        var trie = new RegexTrie();
        trie.contains('alpha').should.equal(false);
    });

    it('should return a phrase when multiple exist', function () {

        var trie = new RegexTrie(),
            phrases      = ['foo', 'bar', 'baz', 'fizz', 'buzz'],
            anti_phrases = ['fo', 'ba', 'fi', 'bu', 'alpha', 'bravo', 123];

        // Add all the phrases, then check they all exist.
        phrases.forEach(trie.add, trie);
        phrases.every(trie.contains, trie);

        // None of these phrases should exist
        anti_phrases.forEach( function (anti_phrase) {
            trie.contains(anti_phrase).should.equal(false);
        });
    });
});
