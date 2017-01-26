"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
 
var http = require('http');
var port = 3000;

var server = http.createServer(function(req, res) {
	res.end("OK");
});

server.listen(port, function() {
	console.log("Listening on port " + port);
});