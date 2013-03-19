/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, node:true, indent:4, maxerr:50, globalstrict:true */

"use strict";

var assert = require('assert');
var util = require('util');
var events = require('events');

function ServerRequest(entry) {
    this.url = entry.url;
    this.method = entry.method || 'GET';
    this.headers = entry.headers || { };
    this.body = entry.body || [ ];
}

util.inherits(ServerRequest, events.EventEmitter);

ServerRequest.prototype.fire = function () {
    var emit = this.emit.bind(this);
    this.body.forEach(function (chunk) {
        emit('data', chunk);
    });
    emit('end');
};

ServerRequest.prototype.noReject = function () {
    this.on('reject', function () {
        assert(false, "Unexpected reject event");
    });
};

function ServerResponse() {
    this.statusCode = 200;
    this.method = 'GET';
    this.headers = { };
    this.data = [ ];
}

util.inherits(ServerResponse, events.EventEmitter);

ServerResponse.prototype.noEnd = function () {
    this.on('end', function () {
        assert(false, "Unexpected end event");
    });
};

ServerResponse.prototype.writeHead = function (statusCode, headers) {
    this.statusCode = statusCode;
    var h = this.headers;
    Object.keys(headers).forEach(function (k) {
        h[k] = headers[k];
    });
};

ServerResponse.prototype.setHeader = function (header, value) {
    this.headers[header] = value;
};

ServerResponse.prototype.getHeader = function (header) {
    return this.headers[header];
};

ServerResponse.prototype.write = function (chunk) {
    this.data.push(chunk);
};

ServerResponse.prototype.end = function () {
};

[ServerRequest, ServerResponse].forEach(function (fn) {
    exports[fn.name] = fn;
});
