require.paths.unshift("../lib");

var sys = require('sys'),
    scylla = require('scylla');

function HelloWorld(name) {
    scylla.Base.call(this);
    this.name = name;
}

HelloWorld.prototype = scylla.beget({

    "GET /$": function(req, res) {
        
        var body = "Hello, " + this.name + "!\n";

        res.writeHead(200, {
            "content-type": "text/plain",
            "content-length": body.length
        });
        res.write(body);
        res.end();

    }

});

DEBUG = true;

require('http').createServer(new HelloWorld("Michael").adapter('nodejs')).listen(8000);

sys.puts('Server running at http://127.0.0.1:8000/');
sys.puts('');
sys.puts('Example:');
sys.puts('');
sys.puts('  $ curl -i -s -X GET http://127.0.0.1:8000/');
