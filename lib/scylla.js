DEBUG = typeof DEBUG == "undefined" ? false : DEBUG;

var sys = require('sys'),
    url = require('url'),
    events = require('events'),
    path = require('path');

function Base(prefix) {

    prefix = prefix || "";

    var regexp = /^(\S+)\s(.+?)$/, parts = null;

    // Rules will almost certainly be processed in the order in
    // which they are defined (even though the JavaScript spec doesn't
    // require this) due to:
    //
    // http://code.google.com/p/chromium/issues/detail?id=883

    this.matchers = { };

    for (r in this) {

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

Base.prototype = {

    dispatch: function (req, res) {

        var i, l, parts, m = this.matchers[req.method] || [];

        for (i = 0, l = m.length; i < l; i++) {
            if ((parts = url.parse(req.url).pathname.match(m[i][0]))) {
                if (DEBUG) { sys.debug(req.method + " " + req.url + " MATCHED"); }
                m[i][1].call(this, req, res, parts);
                return true;
            }
        }

        if (DEBUG) { sys.debug(req.method + " " + req.url + " NOT DISPATCHED"); }
        res.writeHead(404, { });
        res.end();
        return false;

    },

    adapter: function (style) {

        var self = this;

        switch (style) {

            case 'nodejs':
                return function(req, res) {
                    return self.dispatch(req, res);
                };

            default:
                throw new Exception('Adapter style [' + style + '] not supported');

        }
    }
    
};

exports.Base = Base;

exports.beget = function (obj) {
    var derived = Object.create(Base.prototype);
    for (var p in obj) {
        derived[p] = obj[p];
    }
    return derived;
};