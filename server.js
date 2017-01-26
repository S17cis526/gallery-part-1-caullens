"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
 
var http = require('http');
var fs = require('fs');
var port = 3000;

function serveImage(filename, req, res) {
	fs.readFile('images/' + filename, function(err, body) {
		if(err) {
			console.error(err);
			res.statusCode = 500;
			res.statusMessage = "Server error";
			res.end();
			return;
		}
		res.setHeader("Content-Type", "image/jpeg");
		res.end(body);
	});
}

var server = http.createServer(function(req, res) {
	switch(req.url) {
		case "/chess":
			serveImage('chess.jpg', req, res);
			break;
		case "/mobile":
			serveImage('mobile.jpg', req, res);
			break;
		case "/ace":
			serveImage('ace.jpg', req, res);
			break;
		case "/bubble":
			serveImage('bubble.jpg', req, res);
			break;
		case "/fern":
			serveImage('fern.jpg', req, res);
			break;
		default:
			res.statusCode = 404;
			res.statusMessage = "Not found";
			res.end();
	}
});

server.listen(port, function() {
	console.log("Listening on port " + port);
});