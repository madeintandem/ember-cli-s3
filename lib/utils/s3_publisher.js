'use strict';

var AWS  = require('aws-sdk');

function S3Publisher(options) {
  options = options || {};

  setOption(this, options, 'S3_BUCKET_NAME');
  setOption(this, options, 'S3_ACCESS_KEY_ID');
  setOption(this, options, 'S3_SECRET_ACCESS_KEY');

  if (!this.S3_BUCKET_NAME || !this.S3_ACCESS_KEY_ID || !this.S3_SECRET_ACCESS_KEY) {
    throw new Error('No AWS credentials exist.');
  }

  AWS.config.update({ accessKeyId: this.S3_ACCESS_KEY_ID, secretAccessKey: this.S3_SECRET_ACCESS_KEY });
  this.s3 = new AWS.S3();
}

function setOption(object, options, defaultPropName, setPropName) {
  if (!setPropName) {
    setPropName = defaultPropName;
  }

  if (options.hasOwnProperty(defaultPropName)) {
    object[setPropName] = options[defaultPropName];
  } else {
    object[setPropName] = process.env[defaultPropName];
  }
}

S3Publisher.prototype.uploadFile = function(data, type, destination, callback) {
  this.s3.putObject({
    Body: data,
    Bucket: this.S3_BUCKET_NAME,
    ContentType: type,
    Key: destination
  }, callback);
};

module.exports = S3Publisher;
