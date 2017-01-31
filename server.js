"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
 
var http = require('http');
var fs = require('fs');
var port = 3000;

var stylesheet = fs.readFileSync("gallery.css");

var imageNames = ['/chess', '/mobile', '/ace', '/bubble', '/fern'];

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
		case "/gallery":
			var gHtml = imageNames.map(function(filename) {
				return "<image src='" + filename + "' alt='A fishing ace at work'>"
			}).join(' ');
			var html = "<!doctype html>";
			html += "<head>"
			html += "  <title>Gallery</title>";
			html += "  <link href='/gallery.css' type='text/css' rel='stylesheet'>";
			html += "</head>";
			html += "<body>";
			html += "  <h1>Gallery</h1>";
			html += gHtml;
			html += "  <h1>Hello. Time is " + Date.now() + "</hl>";
			html += "  <h2>I like bananas</h2>";
			html += "</body>";
			res.setHeader('Content-Type', 'text/html');
			res.end(html);
			break;
		case "/gallery.css":
			res.setHeader('Content-Type', 'text/css');
			res.end(stylesheet);
			break;
		default:
			res.statusCode = 404;
			res.statusMessage = "Not found";
			var htmlerror = "<!doctype html>";
			htmlerror += "<head><title>Error 404</title></head>";
			htmlerror += "<body>";
			htmlerror += "  <h1>ERROR 404</h1>";
			htmlerror += "    <p>C'mon son, go to a valid URL. This one doesn't exist</p>"
			htmlerror += "</body>"
			res.setHeader('Content-Type', 'text/html');
			res.end(htmlerror);
	}
});

server.listen(port, function() {
	console.log("Listening on port " + port);
});