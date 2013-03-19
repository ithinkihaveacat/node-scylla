/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:false, strict:true, undef:true, unused:true, curly:true, node:true, indent:4, maxerr:50, globalstrict:true */

"use strict";

var assert = require('assert');

function Assurt() {
    this.count = 0;

    process.on('exit', (function () {
        var n_functions = this.count === 1 ? "1 function" : (this.count + " functions");
        assert.equal(this.count, 0, "Failed to call " + n_functions);
    }).bind(this));
}

Assurt.prototype.setScope = function (scope) {
    this.scope = scope;
};

/**
 * Convenience function for checking whether expected matches actual.
 * actual can contain headers not present in expected, but the reverse
 * is not true.
 * 
 * @param  {object} actual
 * @param  {object} expected
 * @return {boolean}
 */
function response(actual, expected) {
    Object.keys(expected.headers).forEach(function (k) {
        assert.equal(actual.headers[k], expected.headers[k]);
    });
    assert.equal(actual.data, expected.data);
}

Assurt.prototype.calls = function (callback) {

    this.count++;

    return (function () {
        this.count--;
        return callback.apply(this.scope, arguments);
    }).bind(this);
};

Assurt.prototype.unreachable = function () {
    return function () {
        assert.fail("Unreachable function called with arguments: " + require('sys').inspect(Array.prototype.slice.call(arguments)));
    }
};

module.exports = Assurt;
