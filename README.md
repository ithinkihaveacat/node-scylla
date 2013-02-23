# Scylla [![Build Status](https://travis-ci.org/ithinkihaveacat/node-scylla.png)](https://travis-ci.org/ithinkihaveacat/node-scylla)

A router/microframework for [NodeJS](http://nodejs.org/).

Scylla:

  * Is tightly tied to HTTP--there's no HTTP abstraction going on.
  * Handles all HTTP verbs more or less equivalently--it's no more
  difficult to handle a DELETE than a GET, for example.
  * Uses standard regular expressions to do the URL matching and
  routing. 

A Scylla application is simply a JavaScript object that inherits from
`scylla.Base`.  To figure out how to route a request, Scylla looks the
method names of this object, which double as URL-matching patterns: the
method `GET /user/(.*)` is invoked when a `GET` request is made for a URL
like `/user/mjs`.  (And `mjs` is passed as an argument to the method.)

If `myapp` is a Scylla object, calling the `dispatcher()` method on it
returns a function suitable for passing to `http.createServer(...)`:

    http.createServer(myapp.adapter('nodejs')).listen(8000);

## Examples

### Hello, World

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

### Other Examples

There are a few Scylla demos in the `examples` directory:

    $ node static.js 
    Server running at http://127.0.0.1:8000/

    Examples:

      $ curl -i -s -X GET http://127.0.0.1:8000/static.js
      $ curl -i -s -X GET http://127.0.0.1:8000/status

## Author

Michael Stillwell<br/>
[mjs@beebo.org](mailto:mjs@beebo.org)<br/>
[@ithinkihaveacat](http://twitter.com/ithinkihaveacat)
