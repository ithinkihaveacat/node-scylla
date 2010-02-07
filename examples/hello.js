require.paths.unshift("../../ejsgi/lib"); // http://github.com/isaacs/ejsgi
require.paths.unshift("../lib");

var sys = require('sys'),
    scylla = require('scylla'),
    ejsgi = require('ejsgi');

function HelloWorld(name) {
    scylla.Base.call(this);
    this.name = name;
}

HelloWorld.prototype = Object.create(scylla.Base.prototype);

process.mixin(HelloWorld.prototype, {

    "GET /": function(req) {
        
        var body = "Hello, " + this.name + "!\n";

        var res = {
            body: new req.jsgi.stream(),
            status: 200,
            headers: {
                "content-type": "text/plain",
                "content-length": body.length
            }
        };
        res.body.write(body);
        res.body.close();

        return res;

    }

});

DEBUG = true;

ejsgi.Server(new HelloWorld("Michael").adapter('ejsgi'), "localhost", 8000).start();
//require('http').createServer(new HelloWorld("Michael").adapter('nodejs')).listen(8000);

sys.puts('Server running at http://127.0.0.1:8000/');
sys.puts('');
sys.puts('Example:');
sys.puts('');
sys.puts('  $ curl -i -s -X GET http://127.0.0.1:8000/');
