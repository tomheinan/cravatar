var express = require('express');
var mkdirp = require('mkdirp');
var fs = require('fs');
var Canvas = require('canvas');
var app = express();

var size = 256;
var minSize = 8;
var maxSize = 512;

var renderFace = function(buffer, httpContext) {
  httpContext.res.type('png');
  httpContext.res.end(buffer, 'binary');
}

var renderPOI = function(buffer, httpContext) {

}

var drawFace = function(image, httpContext) {
  var faceSize = size;
  if (httpContext.req.query.size != undefined && httpContext.req.query.size.match(/^\d+$/)) {
    if (parseInt(httpContext.req.query.size) < minSize) {
      faceSize = minSize;
    } else if (parseInt(httpContext.req.query.size) > maxSize) {
      faceSize = maxSize;
    } else {
      faceSize = parseInt(httpContext.req.query.size);
    }
  }

  if (httpContext.req.query.poi != undefined && httpContext.req.query.poi.match(/^(?:1|true)$/i)) {
    faceSize = 16;
  }

  var canvas = new Canvas(faceSize, faceSize);
  var context = canvas.getContext('2d');
  
  context.patternQuality = 'nearest';
  context.antialias = 'none';
  context.drawImage(image, 8, 8, 8, 8, 0, 0, faceSize, faceSize);
  if (!(httpContext.req.query.hat != undefined && httpContext.req.query.hat.match(/^(?:0|false)$/i))) {
    // if 'hat' is undefined, or 'hat' is anything other than false, draw the hat
    context.drawImage(image, 40, 8, 8, 8, 0, 0, faceSize, faceSize);
  }
  canvas.toBuffer(function(err, buffer) {
    renderFace(buffer, httpContext);
  });
}

app.get(/^\/([A-Za-z0-9\_]+)/, function(req, res) {
  console.log(req.params[0])
  console.log(req.query.poi)

  fs.readFile('./tomheinan.png', function(err, avatar) {
    image = new Canvas.Image;
    image.src = avatar;

    drawFace(image, {req: req, res: res});
  });
});

mkdirp('./cache', function(err) {
  if (err) {
    console.log(err)
  } else {
    app.listen(3000);
  }
});
