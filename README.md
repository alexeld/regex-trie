# RegexTrie
Create a regular expression to match any of the phrases added to the trie (inspired by Dan Kogai's [Regexp::Trie](http://search.cpan.org/~dankogai/Regexp-Trie-0.02/lib/Regexp/Trie.pm) Perl module.

## Installation and Usage

### Node

1. `npm install regex-trie`
2. `require` and use (see the *Usage* section for more comprehensive usage instructions.)
```javascript
var RegexTrie = require('regex-trie'),
    trie      = new RegexTrie(),
    regex     = trie.add('foo').add('bar').toRegExp();
```

### Browser
1. `npm install regex-trie`
2. create your application using `RegexTrie`:
```javascript
// app.js
var RegexTrie = require('regex-trie'),
    trie      = new RegexTrie(),
    regex     = trie.add('foo').add('bar').toRegExp();

console.log(regex);
```
3. Use [browserfy](https://github.com/substack/node-browserify) to create the
   the browser-safe package, e.g.: `browserify app.js -o bundle.js`.

### Usage
```javascript
var RegexTrie = require('regex-trie');

// Create a new RegexTrie instance
var trie = new RegexTrie();

// Add phrases to the trie
trie.add('foo')
    .add('bar')
    .add('baz');

// You can use an array to add phrases if you'd rather (duplicate
// pharses are ignored.)
trie.add(['foo', 'bar', 'baz']);

// Fetch a RegExp to represent all the phrases in the trie
var regex = trie.toRegExp(); // regex => /(?:foo|ba[rz])/

// What matches?
var things_to_match = ['foo', 'bar', 'baz', 'bat', 'fun', 'food'],
    match_results   = things_to_match.map(regex.test, regex);

console.log(match_results);
// => [ true, true, true, false, false, true ]
```

## Methods

### `RegexTrie()` (constructor)

Creates a new instance of `RegexTrie`. Currently doesn't accept any options
however this will likely change as the module evolves.

### `.add(phrase_to_add)`

Adds a new phrase to the trie. Accepts singleton arguments, or an array of
phrases. Ignores any values which aren't literals (objects, bools, arrays,
etc).

```javascript
    trie.add('foo')
        .add('bar')
        .add('baz')
        .add(['who', 'what', 'when', 'where'];
```

All numbers (except `NaN`) are coerced into strings before being added.

Before adding new phrases, the trie is checked to see whether or not that
phrase already exists (using `contains`).

### `.contains(phrase)`

Will check to see if the trie contains a phrase which matches `phrase`, and
return `true` or `false` if the phrase does or does not exist.

### `.toRegExp()`

Returns a `RegExp` instance which should match each individual phrase in the
tree. The trie will escape any character that matches: `/([^A-Za-z0-9_])/`. For
example, if the following values are added, the pipe (OR) will be escaped:

```javascript
    trie.add(['foo', '|', 'bar'].toRegExp();
    // => (?:foo|\||bar)
```

#### Regex Specific Details

The `RegExp` returned by `regex()` is a non-capturing, un-anchored regular
expression meaning it'll never capture its matches and all of the following
phrases will still match:

```javascript
    var regex = trie.add(['foo', 'bar', 'car']).toRegExp();

    ['fool', 'afool', 'bart', 'abart', 'acar', 'acard'].forEach( function (word) {
        console.log(regex.test(word));
    });
    // Output => true, true, true, true, true, true
```

## Development

`regex-trie` uses [Gulp](http://gulpjs.com/) as its build system. Currently
`gulpfile` defines a few tasks:

* `lint` -- `JSHint` (see `.jshintrc` for this project's settings)
* `test` -- runs `mocha` from `gulp`
* `docs` -- `yuidocjs` to produce development documentation
* `watch` -- watches for changes to JS files in `./test/` and `./lib/` and runs the `lint` task
* `default` -- by default the `watch` task runs (which runs `lint`)
* `continuous` -- runs `watch` (which runs `lint`) and `test` on every JS file change.

### Development Dependencies

Please see `package.json` for the latest development dependencies. At the time
of writing, you'll need:

```javascript
    "mocha": "~1.17.1"
    "should": "~3.1.2"
    "gulp-jshint": "~1.4.0"
    "gulp-util": "~2.2.14"
    "gulp": "~3.5.2"
    "gulp-watch": "~0.5.0"
    "blanket": "~1.1.6"
    "gulp-yuidoc": "~0.1.0"
```

## Testing

The tests within `regex-trie` use [mocha](http://mochajs.org/)
with [should.js](https://github.com/visionmedia/should.js/) assertions. To test
the module, just run `mocha` from your terminal.

## TODO

List of things to add aren't in any specific order.

1. Regex options to configure capturing and anchoring
2. Cache compiled trie branches (to speed up RegExp generation)

## License

See `LICENSE.txt` for license rights and limitations (MIT).
