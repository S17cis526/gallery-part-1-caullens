/** @module static
  * Loads and serves static files
  */

module.exports = {
  loadDir: loadDir
}

var files = {};
var fs = require('fs');

function loadDir(directory) {
  var items = fs.readdirSync(directory);
  items.forEach(function(item) {
    var path = directory + '/' + item
    var stats = fs.statSync(path);
    if(stats.isFile()) {
      var parts = path.split('.');
      var extension = parts[parts.length - 1];
      var type = 'application/octet-stream';
      switch(extension) {
        case 'css':
          type = 'text/css';
          break;
        case 'js':
          type = 'text/javascript';
          break;
        case 'jpeg':
          type = 'image/jpeg';
          break;
        case 'gif':
        case 'png':
        case 'bmp':
        case 'tiff':
          type = 'image/' + extension;
          break;
      }
      files[path] = {
        data: fs.readFileSync(path),
        contentType: type
      }
    }
    if(stats.isDirectory()) {
      loadDir(path);
    }
  });
}

function isCached(path) {
  return files[path] != undefined;
}

function serveFile(path, req, res) {
  res.statusCode = 200;
  res.writeHeader('Content-Type', files[path].contentType);
  res.end(file[path].data);
}
