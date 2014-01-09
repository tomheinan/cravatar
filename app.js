var express = require('express');
var mkdirp = require('mkdirp');
var fs = require('fs');
var app = express();

app.get(/^\/([A-Za-z0-9\_]+)/, function(req, res) {
  res.type('png');
  var default = fs.readFile('./default.png');
  res.end(default, 'binary');
});

mkdirp('./cache', function(err) {
  if (err) {
    console.log(err)
  } else {
    app.listen(3000);
  }
});
