/**
  * @module multipart
  * A module for processing multipart HTTP requests
  */

"use strict;"

const DOUBLE_CRLF = Buffer.from([0x0D,0x0A,0x0D,0x0A]);

/**
  * @function multipart
  * Takes a request and response obeject,
  * parses the body of the multipart request
  * and attaches its contents to the request
  * object. If an error, log it
  * and send a 500 status code. Otherwise
  * we invoke next with the request and response.
  */
module.exports = multipart = function(req, res, next) {
	var chunks = [];
	  req.on('error', function(){
		  console.error(err);
		  res.statusCode = 500;
		  res.end();
	  });
	  
	  req.on('data', function(chunk) {
		  chunks.push(chunk);
	  });
	  
	  req.on('end', function() {
		  var boundary = req.headers["ContentType"];
		  var buffer = Buffer.concat(chunks);
		  req.body = processBody(buffer, boundary);
		  next(req, res);
	  });
}

/**
  * @function processBody
  * Takes a buffer and a boundary and
  * returns an associative array of
  * key/value pairs; if content is a
  * file, value will be an object with
  * properties filename, contentType, and
  * data
  */
function processBody(buffer, boundary) {
	var contents = [];
	var start = buffer.indexOf(boundary) + boundary.length + 2;
	var end = buffer.indexOf(boundary, start);
	
	while(end > start) {
		contents.push(buffer.slice(start, end));
		start = end + boundary.length + 2;
		end = buffer.indexOf(boundary, start);
	}
	
	var parsedContents = {};
	contents.forEach(function(content) {
		parseContent(content, function(err, tuple) {
			if(err) return console.error(err);
			parsedContents[tuple[0]] = tuple[1];
		});
	});
	
	return parsedContents;
}

/**
  * @function parseContent
  * Parses a content section and returns
  * the key/value pairs as a two-element array
  */
function parseContent(content, callback) {
	var index = content.indexOf(DOUBLE_CRLF);
	var head = content.slice(0,index).toString();
	var body = content.slice(index+4);
	var name = /name="([\w\d\-_]+)"/.exec(head);
	var filename = /filename="([\w\d\-_\.]+)"/.exec(head);
	var contentType = /Content-Type: ([\w\d\/]+)/.exec(head);
	
	if(!name) return callback("Content without name");
	if(filename) {
		// Have a file
		callback(false, [name[1], {
			filename: filename[1],
			contentType: (contentType)?contentType[1]:'application/octet',
			data: body
		}]);
	}
	else callback(false, [name[1], body.toString()]);
}
  
  