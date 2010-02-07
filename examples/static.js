require.paths.unshift("../../ejsgi/lib"); // http://github.com/isaacs/ejsgi
require.paths.unshift("../lib");

var scylla = require('scylla'),
    ejsgi = require('ejsgi'),
    mime = require('mime'),
    sys = require('sys'),
    url = require('url'),
    posix = require('posix'),
    events = require('events'),
    path = require('path');

function Static(docroot) {

    scylla.Base.call(this);

    this.count = {};
    this.docroot = path.join(process.cwd(), docroot);

}

Static.prototype = Object.create(scylla.Base.prototype);

process.mixin(Static.prototype, {

    'log': function(path) {
        if (path in this.count) {
            this.count[path]++;
        } else {
            this.count[path] = 1;
        }
    },

    'GET (/status)': function(req, matches) {

        this.log(matches[1]);

        var body = sys.inspect(this.count);

        var res = {
            body: new (req.jsgi.stream),
            status: 200,
            headers: {
                "content-type": "application/json",
                "content-length": body.length
            }
        };
        res.body.write(body);
        res.body.close();

        return res;

    },

    "GET /$": function(req) {
        req.url += "index.html";
        return this.dispatch(req);
    },

    'GET (.*)': function(req, matches) {

        var self = this;

        // Check that the docroot is a parent directory of the requested file.
        // i.e. prevent against http://foo/../../etc/passwd.

        var filename = path.join(this.docroot, matches[1]);

        if (filename.indexOf(this.docroot) !== 0) {
            req.next();
        }

        var contentType = mime.extToType(path.extname(req.url));
        var encoding = contentType.slice(0, 4) === "text" ? "utf8" : "binary";

        var promise = new events.Promise();

        var cat = posix.cat(filename, encoding);

        cat.addCallback(function(body) {

            self.log(matches[1]);

            var res = {
                status: 200,
                headers: {
                    "content-type": contentType,
                    "content-length": body.length
                },
                body: new req.jsgi.stream()
            };
            res.body.write(body); // TODO what to do with encoding?
            res.body.close();

            promise.emitSuccess(res);

        });

        cat.addErrback(function() {

            var res = {
                status: 404,
                headers: { },
                body: new req.jsgi.stream()
            }
            res.body.close();

            promise.emitSuccess(res);

        });

        return promise;

    }

});

DEBUG = true;

ejsgi.Server(new Static(".").adapter('ejsgi'), "localhost", 8000).start();
//require('http').createServer(new Static(".").adapter('nodejs')).listen(8000);

sys.puts('Server running at http://127.0.0.1:8000/');
sys.puts('');
sys.puts('Examples:');
sys.puts('');
sys.puts('  $ curl -i -s -X GET http://127.0.0.1:8000/' + path.basename(process.ARGV[1]));
sys.puts('  $ curl -i -s -X GET http://127.0.0.1:8000/status');
