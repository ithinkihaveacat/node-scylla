# Scylla

An [EJSGI-compatible](http://github.com/isaacs/ejsgi) router/microframework
for [NodeJS](http://nodejs.org/).

A Scylla application is simply a JavaScript object that inherits from
`scylla.Base`.  To figure out how to route a request, Scylla looks the
method names of this object, which double as URL-matching patterns: the
method `GET /user/(.*)` is invoked when a `GET` request is made for a URL
like `/user/mjs`.  (And `mjs` is passed as an argument to the method.)

If `myapp` is a Scylla application, calling the `dispatcher()` method on it
returns a EJSGI application suitable for passing to `ejsgi.Server(...)`:

    ejsgi.Server(myapp.dispatcher(), "localhost", 8000).start()

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

Michael Stillwell<br/>
[mjs@beebo.org](mailto:mjs@beebo.org)<br/>
[@ithinkihaveacat](http://twitter.com/ithinkihaveacat)
