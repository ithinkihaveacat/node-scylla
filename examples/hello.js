var Scylla = require('../lib/scylla');

function HelloWorld(name) {
    this.name = name;
    Scylla.call(this);
}

require('util').inherits(HelloWorld, Scylla);

HelloWorld.prototype["GET /$"] = function(req, res) {
        
    var body = "Hello, " + this.name + "!\n";

    res.writeHead(200, {
        "content-type": "text/plain",
    });
    res.write(body);
    res.end();

};

var hello = new HelloWorld("Clem");

var server = require('http').Server();
server.on('request', hello.request.bind(hello));
server.listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
console.log('');
console.log('Example:');
console.log('');
console.log('  $ curl -i -s -X GET http://127.0.0.1:8000/');
