var assert    = require('assert'),
    should    = require('should'),
    RegexTrie = require('../lib/regex-trie.js');

describe('Trie implementation tests', function () {

    it('should be an empty object when the trie is empty', function () {

        var trie = new RegexTrie();
        trie._trie.should.eql({});
    });

    it('should be an empty object when non-string values are added', function () {

    var trie = new RegexTrie();
        
        trie.add(null)
            .add(undefined)
            .add({})
            .add([]);

        trie._trie.should.eql({});
    });

    it('should add a "end = true" to the last char in a phrase', function () {

        var trie = new RegexTrie();

        trie.add('foo')._trie.should.eql({
            f: {
                o: {
                    o: {
                        end: true
                    }
                }
            }
        });
    });
});
