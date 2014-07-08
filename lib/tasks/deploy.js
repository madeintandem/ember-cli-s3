'use strict';

var path = require('path');
var AWS  = require('aws-sdk');

function S3Publisher(options){
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

function setOption(object, options, defaultPropName, setPropName){
  if(!setPropName) { setPropName = defaultPropName};

  if (options.hasOwnProperty(defaultPropName)) {
    object[setPropName] = options[defaultPropName];
  } else {
    object[setPropName] = process.env[defaultPropName];
  }
}

S3Publisher.prototype.uploadFile = function(data, type, destination, callback) {
  console.log("Type: " + type);
  console.log("Destination: " + destination);

  this.s3.putObject({
    Body: data,
    Bucket: this.S3_BUCKET_NAME,
    ContentType: type,
    Key: destination
  }, callback);
};

module.exports = function(env, project) {
  var publisher = new S3Publisher({
    S3_BUCKET_NAME: 'myBucket',
    S3_SECRET_ACCESS_KEY: 's3-secret-access-key',
    S3_ACCESS_KEY_ID: 's3-access-key'
  });

  var filePath = path.join(process.cwd(), 'dist');

  // TODOs
  // Iterate over files in dist
  // Upload files setting correct content type, and check md5 prior to uploading to make sure any S3 file has changed first

  publisher.publish();
};
