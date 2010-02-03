# Scylla

A simple [EJSGI-compatible](http://github.com/isaacs/ejsgi) router for
[NodeJS](http://nodejs.org/).

Scylla converts an object with method names like `GET /user/(.*)` into a
function suitable for passing to `ejsgi.Server(...)`.

## Examples

### Hello, World

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

    ejsgi.Server(new HelloWorld("Michael").dispatcher(), "localhost", 8000).start();

### Other Examples

There are a few Scylla demos in the `examples` directory.  To run them,
first clone the [EJSGI](http://github.com/isaacs/ejsgi) reference
implementation into a directory at the same level as Scylla.  (This is so
that the examples are able to find EJSGI.  If you want to install EJSGI in
another directory, either add this directory to the `NODE_PATH` environment
variable, or modify the examples themselves.)

Then, run the examples from the `examples` directory:

    $ node static.js 
    Server running at http://127.0.0.1:8000/

    Examples:

      $ curl -i -s -X GET http://127.0.0.1:8000/static.js
      $ curl -i -s -X GET http://127.0.0.1:8000/status

## Author

Michael Stillwell
[mjs@beebo.org](mailto:mjs@beebo.org)
<http://beebo.org>
[@ithinkihaveacat](http://twitter.com/ithinkihaveacat)
