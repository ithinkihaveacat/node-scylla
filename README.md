# Scylla [![Build Status](https://travis-ci.org/ithinkihaveacat/node-scylla.png?branch=master)](https://travis-ci.org/ithinkihaveacat/node-scylla)

A router/microframework for [NodeJS](http://nodejs.org/).

Scylla:

  * Is tightly tied to HTTP--there's no HTTP abstraction going on.
  * Handles all HTTP verbs more or less equivalently--it's no more
  difficult to handle a DELETE than a GET, for example.
  * Uses standard regular expressions to do the URL matching and
  routing. 

A Scylla application is simply a JavaScript object that inherits from `Scylla`.
To figure out how to route a request, Scylla looks the method names of this
object, which doubles as URL-matching patterns: the method `GET /user/(.*)` is
invoked when a `GET` request is made for a URL like `/user/mjs`. (And `mjs` is
passed as an argument to the method.)

You can create a web server from a `myapp` object by passing it to a `http.Server` as follows:

````js
http.createServer(function (req, res) {
  myapp.request(req, res);
}).listen(8000);
````

Or, equivalently (but shorter):

````js
http.createServer(myapp.request.bind(myapp)).listen(8000);
````

## Examples

### Hello, World

````js
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
````

### Other Examples

There are a few Scylla demos in the `examples` directory:

````sh
$ node static.js 
Server running at http://127.0.0.1:8000/

Examples:

  $ curl -i -s -X GET http://127.0.0.1:8000/static.js
  $ curl -i -s -X GET http://127.0.0.1:8000/status
````

## Author

Michael Stillwell<br/>
[mjs@beebo.org](mailto:mjs@beebo.org)<br/>
[@ithinkihaveacat](http://twitter.com/ithinkihaveacat)
