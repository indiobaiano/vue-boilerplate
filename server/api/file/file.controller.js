'use strict';

var _ = require('lodash');
var File = require('./file.model');

// Get list of files
exports.index = function(req, res) {
  File.find({'metadata.user':req.user._id})
  .sort('-uploadDate')
  .skip(req.range.first)
  .limit(req.range.last-req.range.first+1)
  .exec(function (err, files) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(files);
  });
};

// Get a single file
exports.show = function(req, res) {
  File.findById(req.params.id, function (err, file) {
    if(err) { return handleError(res, err); }
    if(!file) { return res.status(404).send('Not Found'); }
    return res.json(file);
  });
};

// Creates a new file in the DB.
exports.create = function(req, res, next) {
  console.log(req.file)
  File.findById(req.file.id, function (err, file) {
    if (err) {
      return handleError(err)
    }
    res.json(file)
  })
};

// Updates an existing file in the DB.
exports.update = function(req, res) {
  res.send('')
};

// Deletes a file from the DB.
exports.destroy = function(req, res) {
  gfs.remove({_id:req.params.id}, function (err, file) {
    if(err) { return handleError(res, err); }
    return res.send('');
  });
};

exports.count = function(req, res, next) {
  File.count({}, function(err, count){console.log('file count:', count)
    res.range({first:req.range.first,last:req.range.last,length:count});
    next();
  })
};

function handleError(res, err) {
  return res.status(500).send(err);
}