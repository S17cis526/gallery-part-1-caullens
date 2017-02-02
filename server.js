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

function getImageNames(callback) {
	fs.readdir("images/", function(err, filenames) {
		if(err) callback(err, undefined);
		else callback(false, filenames);
	});
}

function imageNamesToTags(filenames) {
	return filenames.map(function(filename) {
		return `<a href="${filename}"><img src="${filename}" alt="${filename}"></a>`;
	});
}

function serveGallery(req, res) {
	getImageNames(function(err, imagenames) {
		if(err) {
			console.error(err);
			res.statusCode = 404;
			res.statusMessage = 'Resource not found';
			res.end();
			return;
		}
		res.setHeader('Content-Type', 'text/html');
		res.end(buildGallery(imagenames));
	});
}

function buildGallery(imagetags) {
	var html = "<!doctype html>";
	html += "<head>"
	html += "  <title>Gallery</title>";
	html += "  <link href='/gallery.css' type='text/css' rel='stylesheet'>";
	html += "</head>";
	html += "<body>";
	html += "  <h1>Gallery</h1>";
	html += imageNamesToTags(imagetags).join(' ');
	html += "  <h1>Hello. Time is " + Date.now() + "</hl>";
	html += "  <h2>I like bananas</h2>";
	html += "</body>";
	return html;
}

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
		case "/":
		case "":
		case "/gallery":
			serveGallery(req, res);
			break;
		case "/gallery.css":
			res.setHeader('Content-Type', 'text/css');
			res.end(stylesheet);
			break;
		default:
			serveImage(req.url, req, res);
	}
});

server.listen(port, function() {
	console.log("Listening on port " + port);
});