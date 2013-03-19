var Assurt = require("./assurt");
var assert = require("assert");
var http = require("./http");

var assurt = new Assurt();

var Scylla = require("../lib/scylla");

function Hello(name) {
    this.name = name;
    Scylla.call(this);
}

require('util').inherits(Hello, Scylla);

Hello.prototype["GET /$"] = assurt.calls(function(req, res) {

    var body = "Hello, " + this.name + "!";

    res.writeHead(200, {
        "content-type": "text/plain"
    });
    res.write(body);
    res.end();
});

var hello = new Hello("Clem");
assurt.setScope(hello);

var req = new http.ServerRequest({
    method: "GET",
    url: "/"
});

var res = new http.ServerResponse();

hello.request(req, res);

var expected = {
    statusCode: 200,
    method: "GET",
    data: [ "Hello, Clem!" ],
    headers: {
        "content-type": "text/plain"
    }
};

Object.keys(expected).forEach(function (k) {
    if (k === "headers") return;
    assert.equal(JSON.stringify(res[k]), JSON.stringify(expected[k]));
});

Object.keys(expected.headers).forEach(function (k) {
    assert.equal(res.headers[k], expected.headers[k]);
});
