var Scylla = require('../lib/scylla');

function NameDemo(name) {
    this.name = name;
    Scylla.call(this);
}

require('util').inherits(NameDemo, Scylla);

NameDemo.prototype.send = function (req, res) {

    var body = JSON.stringify(this.name) + "\n";

    res.writeHead(200, {
        "content-type": "application/json",
        "content-length": body.length
    });
    res.write(body);
    res.end();

};

// curl -i -s http://127.0.0.1:8000/name

NameDemo.prototype["GET /name"] = function (req, res) {
    return this.send(req, res);
};

// curl -i -s -X PUT -d '"Michael"' http://127.0.0.1:8000/name

NameDemo.prototype["PUT /name"] = function (req, res) {

    var body = "", self = this;

    req.addListener("data", function(s) {
        body += s;
    });
    
    req.addListener("end", function() {
        self.name = JSON.parse(body); // Assumes body is JSON
        console.info("Setting name to " + self.name);
        self.send(req, res);
    });

};

DEBUG = true;

var nameDemo = new NameDemo("Clem");

var server = require('http').Server();
server.on('request', nameDemo.request.bind(nameDemo));
server.listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
console.log('');
console.log('Examples:');
console.log('');
console.log('  $ curl -i -s -X GET http://127.0.0.1:8000/name');
console.log('  $ curl -i -s -X PUT -d \'"Michael"\' http://127.0.0.1:8000/name');
console.log('  $ curl -i -s -X GET http://127.0.0.1:8000/name');
