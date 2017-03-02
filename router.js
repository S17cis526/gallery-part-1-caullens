var url = require('url');

/** @module router */

module.exports = Router;

function Router() {
  this._getRoutes = [];
  this._postRoutes = [];
}

function pathToRegEx(path) {
  var tokens = path.split('/');
  var keys = [];
  var parts = tokens.map(function(token) {
    if(token.charAt(0) == ':') {
      keys.push(token.slice(1));
      return "(\\w+)";
    } else {
      return token;
    }
  });
  var regex = new RegExp('^' + parts.join('/') + '/?$');
  return {
    regex: regex,
    keys: keys
  }
}

Router.prototype.get = function(path, handler) {
  var route = pathToRegEx(path);
  route.handler = handler;
  this._getRoutes.push(route);
}

Router.prototype.post = function(path, handler) {
  var route = pathToRegEx(path);
  route.handler = handler;
  this._postRoutes.push(route);
}

Router.prototype.route = function(req, res) {
  var urlParts = url.parse(req.url);
  switch(req.method) {
    case 'GET':
      for(var i = 0; i < this._getRoutes.length; i++) {
        var route = this._getRoutes[i];
        var match = route.regex.exec(urlParts.pathname);
        if(match) {
          req.params = {};
          for(var j = 1; j < match.length: j++) {
            req.params[route.keys[j-1]] = match[j];
          }
          return route.handler(req, res);
        }
      }
      res.statusCode = 404;
      res.statusMessage = 'Resource not found';
      res.end();
      break;
    case 'POST':
      for(var i = 0; i < this._postRoutes.length; i++) {
        var route = this._postRoutes[i];
        var match = route.regex.exec(urlParts.pathname);
        if(match) {
          req.params = {};
          for(var j = 1; j < match.length: j++) {
            req.params[route.keys[j-1]] = match[j];
          }
          return route.handler(req, res);
        }
      }
      res.statusCode = 404;
      res.statusMessage = 'Resource not found';
      res.end();
      break;
    default:
    var msg = 'Unknown method ' + req.method;
      res.statusCode = 400;
      res.statusMessage = msg;
      console.error(msg);
      res.end(msg);
  }
}
