var assert    = require('assert'),
    should    = require('should'),
    RegexTrie = require('../lib/regex-trie.js');

describe('#add()', function () {

    it('should add a single word and return itself', function () {

        var trie   = new RegexTrie(),
            result = trie.add('alpha');

        result.should.be.instanceof(RegexTrie);
    });

    it('should count the number of words added to the trie', function () {

        var trie = new RegexTrie();

        trie.add('alpha');
        trie._num_phrases_in_trie.should.be.exactly(1);

        // Add multiple words
        trie.add('bravo')
            .add('charlie')
            .add('delta');

        trie._num_phrases_in_trie.should.be.exactly(4);
    });

    it('should add an array of strings', function () {

        var trie = new RegexTrie();
        trie.add([
            'alpha',
            'bravo',
            'charlie',
            'delta'
        ]);

        trie._num_phrases_in_trie.should.be.exactly(4);
    });

    it('should not increment the count for an undefined value', function () {
        
        var trie = new RegexTrie();

        trie.add()
            .add(undefined)
            .add(null)
            .add('')
            .add({})
            .add([])
            .add(this)
            .add(true)
            .add(false)
            .add(/foo|bar/);

        trie._num_phrases_in_trie.should.be.exactly(0);
    });

    it('should coerce a number to a string before adding it', function () {
        
        var trie = new RegexTrie();

        trie.add(42);
        trie._num_phrases_in_trie.should.be.exactly(1);

        trie.add(1337)
            .add(13)
            .add(37);

        trie._num_phrases_in_trie.should.be.exactly(4);

        trie.add("12")
            .add(34)
            .add(56)
            .add('78')
            .add(13.37)
            .add('3.14')
            .add(0x5a);

        trie._num_phrases_in_trie.should.be.exactly(11);
    });

    it('should not add NaN', function () {

        var trie = new RegexTrie();

        trie.add(NaN);
        trie._num_phrases_in_trie.should.be.exactly(0);
    });

    it('should add an array of strings and numbers', function () {

        var trie = new RegexTrie();

        trie.add([
            'alpha',
            'bravo',
            42,
            1337,
            0x6a
        ]);

        trie._num_phrases_in_trie.should.be.exactly(5);

        trie.add([
            'charlie',
            'delta',
            {},
            null,
            undefined,
            this,
            [],
            -1
        ]);

        trie._num_phrases_in_trie.should.be.exactly(8);
    });

    it('should not add any elements from an object', function () {

        var trie = new RegexTrie();

        trie.add({
            alpha: 'alpha',
            bravo: 'bravo'
        });

        trie._num_phrases_in_trie.should.be.exactly(0);

        trie.add([
            { alpha: 'alpha' },
            { bravo: 'bravo' }
        ]);

        trie._num_phrases_in_trie.should.be.exactly(0);
    });
});
