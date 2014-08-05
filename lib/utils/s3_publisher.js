'use strict';

var AWS = require('aws-sdk');
var chalk = require('chalk');
var Promise = require('../ext/promise');

function S3Publisher(options) {
  options = options || {};

  setOption(this, options, 'S3_BUCKET_NAME');
  setOption(this, options, 'S3_ACCESS_KEY_ID');
  setOption(this, options, 'S3_SECRET_ACCESS_KEY');
  setOption(this, options, 'ui');

  if (!this.S3_BUCKET_NAME || !this.S3_ACCESS_KEY_ID || !this.S3_SECRET_ACCESS_KEY) {
    throw new Error('No AWS credentials exist.');
  }

  AWS.config.update({ accessKeyId: this.S3_ACCESS_KEY_ID, secretAccessKey: this.S3_SECRET_ACCESS_KEY });
  this.s3 = new AWS.S3();
  this.s3.putObject = Promise.denodeify(this.s3.putObject.bind(this.s3));
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

S3Publisher.prototype.finishedFileUpload = function(error, result) {
  if (error) {
    var errorMsg = 'S3 Upload failed with the following error: ' + error;
    this.ui.write(chalk.red(errorMsg));
    throw new Error(errorMsg);
  }
};

S3Publisher.prototype.uploadFile = function(data, type, destination) {
  this.ui.write(chalk.green('Uploading ' + destination + ' to S3.\n'));
  var params = {
    Body: data,
    Bucket: this.S3_BUCKET_NAME,
    ContentType: type,
    Key: destination
  };

  return this.s3.putObject(params)
    .then(this.finishedFileUpload.bind(this));
};

module.exports = S3Publisher;
