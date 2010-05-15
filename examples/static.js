require.paths.unshift("../lib");

var scylla = require('scylla'),
    mime = require('mime'),
    sys = require('sys'),
    url = require('url'),
    fs = require('fs'),
    events = require('events'),
    path = require('path');

function Static(docroot) {

    scylla.Base.call(this);

    this.count = {};
    this.docroot = path.join(process.cwd(), docroot);

}

Static.prototype = scylla.beget({

    'log': function (path) {
        if (path in this.count) {
            this.count[path]++;
        } else {
            this.count[path] = 1;
        }
    },

    'GET (/status)': function (req, res, matches) {

        this.log(matches[1]);

        var body = sys.inspect(this.count) + "\n";

        res.writeHead(200, {
            "content-type": "application/json",
            "content-length": body.length
        });
        res.write(body);
        res.end();

    },

    "GET /$": function (req, res) {
        req.url += "index.html";
        return this.dispatch(req, res);
    },

    'GET (.*)': function (req, res, matches) {

        var self = this;

        // Check that the docroot is a parent directory of the requested file.
        // i.e. prevent against http://foo/../../etc/passwd.

        var filename = path.join(this.docroot, matches[1]);

        if (filename.indexOf(this.docroot) !== 0) {
            res.writeHead(404, {});
            res.end();
            return;
        }

        var contentType = mime.extToType(path.extname(req.url));
        var encoding = contentType.slice(0, 4) === "text" ? "utf8" : "binary"; // TODO Not very reliable!

        fs.readFile(filename, encoding, function (error, body) {

            if (error) {
                res.writeHead(404, {});
                res.end();
                return;
            }

            self.log(matches[1]);

            res.writeHead(200, {
                "content-type": contentType,
                "content-length": body.length
            });
            res.write(body);
            res.end();

        });

    }

});

DEBUG = true;

require('http').createServer(new Static(".").adapter('nodejs')).listen(8000);

sys.puts('Server running at http://127.0.0.1:8000/');
sys.puts('');
sys.puts('Examples:');
sys.puts('');
sys.puts('  $ curl -i -s -X GET http://127.0.0.1:8000/' + path.basename(process.ARGV[1]));
sys.puts('  $ curl -i -s -X GET http://127.0.0.1:8000/status');
