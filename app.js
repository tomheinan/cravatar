var express = require('express');
var mkdirp = require('mkdirp');
var fs = require('fs');
var gm = require('gm');
var app = express();

app.get(/^\/([A-Za-z0-9\_]+)/, function(req, res) {
  res.type('png');
  var def = fs.readFileSync('./default.png');
  res.end(def, 'binary');
});



mkdirp('./cache', function(err) {
  if (err) {
    console.log(err)
  } else {
    app.listen(3000);
  }
});
