require.paths.unshift("../lib");

var sys = require('sys'),
    events = require('events'),
    scylla = require('scylla');

function NameDemo(name) {
    scylla.Base.call(this);
    this.name = name;
}

NameDemo.prototype = scylla.inherit(scylla.Base.prototype, {

    send: function (req, res) {

        var body = JSON.stringify(this.name) + "\n";

        res.writeHead(200, {
            "content-type": "application/json",
            "content-length": body.length
        });
        res.write(body);
        res.end();

    },

    // curl -i -s http://127.0.0.1:8000/name

    "GET /name": function (req, res) {
        return this.send(req, res);
    },

    // curl -i -s -X PUT -d '"Michael"' http://127.0.0.1:8000/name

    "PUT /name": function (req, res) {

        var body = "", self = this;

        req.addListener("data", function(s) {
            body += s;
        });
        
        req.addListener("end", function() {
            self.name = JSON.parse(body); // Assumes body is JSON
            sys.debug("Setting name to " + self.name);
            self.send(req, res);
        });

    }

});

DEBUG = true;

require('http').createServer(new NameDemo("Clem").adapter('nodejs')).listen(8000);

sys.puts('Server running at http://127.0.0.1:8000/');
sys.puts('');
sys.puts('Examples:');
sys.puts('');
sys.puts('  $ curl -i -s -X GET http://127.0.0.1:8000/name');
sys.puts('  $ curl -i -s -X PUT -d \'"Michael"\' http://127.0.0.1:8000/name');
sys.puts('  $ curl -i -s -X GET http://127.0.0.1:8000/name');
