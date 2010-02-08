DEBUG = typeof DEBUG == "undefined" ? false : DEBUG;

var sys = require('sys'),
    url = require('url'),
    posix = require('posix'),
    events = require('events'),
    path = require('path'),
    Request = require('ejsgi/request');

function Base() {

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
                new RegExp(parts[2]),
                this[r]
            ]);

        }

    }

}

process.mixin(Base.prototype, {

    dispatch: function(req) {

        var i, l, parts, m = this.matchers[req.method] || [], res;

        for (i = 0, l = m.length; i < l; i++) {
            if ((parts = url.parse(req.url).pathname.match(m[i][0]))) {
                if (DEBUG) { sys.debug(req.method + " " + req.url + " MATCHED"); }
                return m[i][1].call(this, req, parts);
            }
        }

        if (DEBUG) { sys.debug(req.method + " " + req.url + " NOT DISPATCHED"); }

        res = {
            status: 404,
            headers: { },
            body: new req.jsgi.stream()
        }
        res.body.close();

        return res;

    },

    adapter: function(style) {

        var self = this;

        switch (style) {

            case 'ejsgi': return function(req) {
                return self.dispatch(req);
            }

            case 'nodejs': return function(req, res) {

                function respond(r) {

                    res.sendHeader(r.status, r.headers);

                    r.body.addListener("data", function(chunk) {
                        res.sendBody(chunk); // TODO Where to get encoding from?
                    })

                    r.body.addListener("end", function() {
                        res.finish();
                    });
                    
                }

                var parts = url.parse(req.url);

                var tmp = self.dispatch(new Request(req, res, parts.hostname, parts.port || 80, null, parts.protocol === 'https:'));
                
                if (tmp instanceof events.Promise) {
                    tmp.addListener("success", function(r) { respond(r); });
                } else {
                    respond(tmp);
                }

            }

            default:
                throw new Exception('Adapter style [' + style + '] not supported');

        }
    }

});

exports.Base = Base;
