var assert    = require('assert'),
    should    = require('should'),
    RegexTrie = require('../lib/regex-trie.js');

describe('Provide a new-agnostic constructor', function () {

    it('should create the same instance without needing new', function () {
        var trie  = RegexTrie(),
            trie2 = new RegexTrie();

        trie.should.be.instanceof(RegexTrie);
        trie2.should.be.instanceof(RegexTrie);

        trie.should.eql(trie2);
    });
});

