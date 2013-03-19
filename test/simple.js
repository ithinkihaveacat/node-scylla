var Assurt = require("./assurt");
var assert = require("assert");
var http = require("./http");

var Scylla = require("../lib/scylla");

var assurt = new Assurt();

function Simple() {
    Scylla.call(this);
}

require('util').inherits(Simple, Scylla);

Simple.prototype["GET /$"] = assurt.calls(function() { });

var simple = new Simple();
assurt.setScope(simple);

var req = new http.ServerRequest({
    method: "GET",
    url: "/"
});

var res = new http.ServerResponse();

simple.request(req, res);
