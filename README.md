# Scylla

An [EJSGI-compatible](http://github.com/isaacs/ejsgi) router/microframework
for [NodeJS](http://nodejs.org/).

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

    HelloWorld.prototype = Object.create(scylla.Base.prototype);

    process.mixin(HelloWorld.prototype, {

        "GET /": function(req, res) {

            var body = "Hello, " + this.name + "!\n";

            res.writeHeader(200, {
                "content-type": "text/plain",
                "content-length": body.length
            });
            res.write(body);
            res.close();

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
