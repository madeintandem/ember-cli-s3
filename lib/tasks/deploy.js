'use strict';

var path = require('path');
var S3Publisher = require('../utils/s3_publisher');
var glob = require('glob');
var Promise = require('../ext/promise');

module.exports = {
  fileTypes: {
    '.css': 'text/css',
    '.js': 'text/javascript'
  },

  run: function(env, project) {
    var distDirectory = path.join(process.cwd(), 'dist', '/**/*');

    return glob(distDirectory, this.processDistFiles);
  },

  processDistFiles: function(errorObject, fileNames) {
    console.log('processDistFiles');

    if (errorObject) {
      return; // TODO: Error handling
    }

    fileNames.forEach(this.uploadDistFile);

    return Promise.resolve();
  },

  fileType: function(fileName) {
    var extension = path.extname(fileName);

    var type = this.fileTypes[extension];

    return type;
  },

  uploadDistFile: function(fileName) {
    var publisher = new S3Publisher({
      S3_BUCKET_NAME: 'myBucket',
      S3_SECRET_ACCESS_KEY: 's3-secret-access-key',
      S3_ACCESS_KEY_ID: 's3-access-key'
    });

    publisher.uploadFile(fileName, this.fileType(fileName), fileName);
  }
};
