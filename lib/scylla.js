/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:false, strict:true, undef:true, unused:true, curly:true, node:true, indent:4, maxerr:50, globalstrict:true */

"use strict";

var url = require('url');

function Scylla(prefix) {

    prefix = prefix || "";

    var regexp = /^(\S+)\s(.+?)$/, parts = null;

    // Rules will almost certainly be processed in the order in
    // which they are defined (even though the JavaScript spec doesn't
    // require this) due to:
    //
    // http://code.google.com/p/chromium/issues/detail?id=883

    this.matchers = { };

    for (var r in this) {

        if ((parts = r.match(regexp))) {

            if (!this.matchers[parts[1]]) {
                this.matchers[parts[1]] = [];
            }

            this.matchers[parts[1]].push([
                new RegExp(prefix + parts[2]),
                this[r]
            ]);

        }

    }

}

Scylla.prototype.request = function (req, res) {

    var i, l, parts, m = this.matchers[req.method] || [];

    for (i = 0, l = m.length; i < l; i++) {
        if ((parts = url.parse(req.url).pathname.match(m[i][0]))) {
            console.warn(req.method + " " + req.url + " MATCHED");
            m[i][1].call(this, req, res, parts);
            return true;
        }
    }

    console.warn(req.method + " " + req.url + " NOT MATCHED");
    res.writeHead(404, { });
    res.end();
    return false;

};

module.exports = Scylla;
