var Scylla = require('../lib/scylla');
var mime = require('../lib/mime');
var url = require('url');
var fs = require('fs');
var path = require('path');
var sys = require('sys');

function Static(docroot) {
    this.count = {};
    this.docroot = path.join(process.cwd(), docroot);
    Scylla.call(this);
}

require('util').inherits(Static, Scylla);

Static.prototype.log = function (path) {
    if (path in this.count) {
        this.count[path]++;
    } else {
        this.count[path] = 1;
    }
};

Static.prototype['GET (/status)'] = function (req, res, matches) {

    this.log(matches[1]);

    var body = sys.inspect(this.count) + "\n";

    res.writeHead(200, {
        "content-type": "application/json"
    });
    res.write(body);
    res.end();

};

Static.prototype["GET /$"] = function (req, res) {
    req.url += "index.html";
    this.request(req, res); // forward/redirect
};

Static.prototype['GET (.*)'] = function (req, res, matches) {

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

};

var static = new Static(".");

var server = require('http').Server();
server.on('request', static.request.bind(static));
server.listen(8000);

sys.puts('Server running at http://127.0.0.1:8000/');
sys.puts('');
sys.puts('Examples:');
sys.puts('');
sys.puts('  $ curl -i -s -X GET http://127.0.0.1:8000/' + path.basename(process.argv[1]));
sys.puts('  $ curl -i -s -X GET http://127.0.0.1:8000/status');
