require.paths.unshift("../../ejsgi/lib");
require.paths.unshift("../lib");

var sys = require('sys'),
    events = require('events'),
    scylla = require('scylla'),
    ejsgi = require('ejsgi');

function NameDemo(name) {
    scylla.Base.call(this);
    this.name = name;
}

NameDemo.prototype = Object.create(scylla.Base.prototype);

process.mixin(NameDemo.prototype, {

    send: function(req) {

        var body = JSON.stringify(this.name) + "\n";

        var res = {
            status: 200,
            headers: {
                "content-type": "application/json",
                "content-length": body.length
            },
            body: new req.jsgi.stream()
        };
        res.body.write(body); // TODO what to do with encoding?
        res.body.close();

        return res;
    },

    // curl -i -s http://127.0.0.1:8000/name

    "GET /name": function(req) {
        return this.send(req);
    },

    // curl -i -s -X PUT -d '"Michael"' http://127.0.0.1:8000/name

    "PUT /name": function(req) {

        var body = "", self = this, promise = new events.Promise();

        req.input.addListener("data", function(s) {
            body += s;
        });
        
        req.input.addListener("end", function() {
            self.name = JSON.parse(body); // Assumes body is JSON
            sys.debug("Setting name to " + self.name);
            promise.emitSuccess(self.send(req));
        });

        return promise;

    }

});

DEBUG = true;

ejsgi.Server(new NameDemo("Clem").adapter('ejsgi'), "localhost", 8000).start();
//require('http').createServer(new NameDemo("Clem").adapter('nodejs')).listen(8000);

sys.puts('Server running at http://127.0.0.1:8000/');
sys.puts('');
sys.puts('Examples:');
sys.puts('');
sys.puts('  $ curl -i -s -X GET http://127.0.0.1:8000/name');
sys.puts('  $ curl -i -s -X PUT -d \'"Michael"\' http://127.0.0.1:8000/name');
sys.puts('  $ curl -i -s -X GET http://127.0.0.1:8000/name');
