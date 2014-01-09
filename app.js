var express = require('express');
var mkdirp = require('mkdirp');
var app = express();

app.get(/^\/([A-Za-z0-9\_]+)/, function(req, res) {
  res.setHeader('Content-type', "image/png");


});

mkdirp('./cache', function(err) {
  if (err) {
    console.log(err)
  } else {
    app.listen(3000);
  }
});
