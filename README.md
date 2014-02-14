# RegexTrie v0.0.1
Create a regular expression to match any of the phrases added to the trie (inspired by Dan Kogai's [Regexp::Trie](http://search.cpan.org/~dankogai/Regexp-Trie-0.02/lib/Regexp/Trie.pm) Perl module.

## Example
```
var RegexTrie = require('./lib/regex-trie');

// Create a new RegexTrie instance
var trie = new RegexTrie();

// Add phrases to the trie
trie.add('foo')
    .add('bar')
    .add('baz');

// You can use an array to add phrases if you'd rather
trie.add(['foo', 'bar', 'baz']);

// Fetch a RegExp to represent all the phrases in the trie
var regex = trie.regex(); // 

console.log(regex);

// What matches?
var things_to_match = ['foo', 'bar', 'baz', 'bat', 'fun', 'food'],
    match_results   = things_to_match.map(regex.test, regex);

console.log(match_results);
// => [ true, true, true, false, false, true ]
```
