var jsesc = require('jsesc');

/**
 * @module regex-trie
 */
var RegexTrie = (function () {

    "use strict";

    /**
     * The `RegexTrie` class builds a regular expression from a set of phrases
     * added to it. It produces a non-optimised `RegExp` and only represents
     * literal characters; only alphanumeric or underscore ("_") characters are
     * left unescaped.
     *
     * @class RegexTrie
     * @constructor
     */
    var RegexTrie = function () {

        if ( ! (this instanceof RegexTrie) ) {
            return new RegexTrie();
        }

        this._num_phrases_in_trie = 0;
        this._trie = {};

        return this;
    };

    /**
     *
     * Phrases can be added to the trie using `add`. Elements can be wrapped in
     * an array before being added. Only alphanumeric values will be added.
     * Objects, booleans, arrays, etc will all be ignored (failed attempts to
     * add values are silent.)
     *
     * @method add()
     * @param phrase_to_add {array|string|number}
     * @chainable
     */
    RegexTrie.prototype.add = function (phrase_to_add) {

        if ( phrase_to_add instanceof Array ) {
            phrase_to_add.forEach(this.add, this);
        }

        phrase_to_add = this._coerce_to_string(phrase_to_add);

        if ( ! this._is_phrase_valid(phrase_to_add) ) {
            return this;
        }

        // Has this phrase already been added?
        if ( this.contains(phrase_to_add) ) {
            return this;
        }

        var trie = this._trie;

        phrase_to_add.split('').forEach( function (chr) {

            if ( chr in trie ) {

                trie = trie[chr];
                return;
            }

            trie[chr] = {};
            trie      = trie[chr];
        }, this);

        // Set the end marker (so we know this was a complete word)
        trie.end = true;
        this._num_phrases_in_trie++;

        return this;
    };

    RegexTrie.prototype.toRegExp = function () {

        if ( this._num_phrases_in_trie === 0 ) return;

        var result = this.toString();
        return new RegExp(result);
    };

    RegexTrie.prototype.toString = function () {

        if ( this._num_phrases_in_trie === 0 ) return;

        var _walk_trie = function (trie, this_arg) {

            var keys   = Object.keys(trie),
            alt_group  = [],
            char_class = [],
            end        = false; // marks the end of a phrase

            keys.forEach( function (key) {

                var walk_result, insert;

                if ( key === 'end' ) {
                    end = true;
                    return;
                }

                walk_result =
                    this._quotemeta(key) + _walk_trie(trie[key], this_arg);

                // When we have more than one key, `insert` references
                // the alternative regexp group, otherwise it points to
                // the char class group.
                insert = ( keys.length > 1 ) ? [].push.bind(alt_group)
                                             : [].push.bind(char_class);
                insert(walk_result);
            }, this_arg);

            return this_arg._to_regex(alt_group, char_class, end);
        };

        var result = _walk_trie(this._trie, this);
        return result;
    };

    RegexTrie.prototype._to_regex = function (alt_group, char_class, end) {

        var group_has_one_element = function (el) {
                return el.length === 1;
            },
            result = "";

        // Once we've finished walking through the tree we need to build
        // the regex match groups...
        if ( alt_group.length > 0 ) {

            if ( alt_group.length === 1 ) {
                // Individual elements are merged with the current result.
                result += alt_group[0];
            }
            else if ( alt_group.every(group_has_one_element) ) {
                // When every single array in the alternative group is
                // a single element array, this gets flattened in to
                // a character class.
                result += ( '[' + alt_group.join('') + ']' );
            }
            else {
                // Finally, build a non-capturing alternative group.
                result += ( '(?:' + alt_group.join('|') + ')' );
            }
        }
        else if ( char_class.length > 0 ) {
            result += char_class[0];
        }

        if ( end && result ) {

            if ( result.length === 1 ) {
                result += '?';
            }
            else {
                result = '(?:' + result + ')?';
            }
        }

        return result;
    };

    RegexTrie.prototype.contains = function (phrase_to_fetch) {

        if ( ! this._is_phrase_valid(phrase_to_fetch) &&
                this._num_phrases_in_trie > 0 ) {
            return false;
        }

        var trie = this._trie;

        // Wrap the attempts to contains in a try/catch block; any non-existant
        // keys will cause an exception, which we treat as 'this value does not
        // exist'.
        try {

            phrase_to_fetch.split('').forEach( function (chr) {
                trie = trie[chr];
            });

            return ( trie.hasOwnProperty('end') && trie.end === true );
        }
        catch (e) {
            // Fall through
        }

        return false;
    };

    RegexTrie.prototype._coerce_to_string = function (phrase) {

        if ( typeof phrase === 'number' && ! isNaN(phrase) ) {
            phrase = phrase.toString();
        }

        return phrase;
    };

    RegexTrie.prototype._is_phrase_valid = function (phrase) {
        return ( typeof phrase === 'string' && phrase.length > 0 );
    };

    RegexTrie.prototype._quotemeta = function (phrase) {

        if ( ! this._is_phrase_valid(phrase) ) {
            return phrase;
        }

        return phrase
            .replace(/([\t\n\f\r\\\$\(\)\*\+\-\.\?\[\]\^\{\|\}])/g, '\\$1')
            .replace(/[^\x20-\x7E]/g, jsesc);
    };

    return RegexTrie;
})();

module.exports = RegexTrie;
