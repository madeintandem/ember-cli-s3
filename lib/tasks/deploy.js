'use strict';

var chalk = require('chalk');
var path = require('path');
var S3Publisher = require('../utils/s3_publisher');
var Promise = require('../ext/promise');
var fs = require('fs');
var glob = Promise.denodeify(require('glob'));

module.exports = {
  fileTypes: {
    '.css': 'text/css',
    '.js': 'text/javascript'
  },

  run: function(env, outputPath, project, ui) {
    this.ui = ui;

    this.distDirectory = path.join(process.cwd(), outputPath);

    return glob(this.distDirectory + '/**/*').then(this.processDistFiles.bind(this));
  },

  processDistFiles: function(filePaths, errorObject) {
    if (errorObject) {
      throw new Error('An error occurred processing output directory files' + errorObject);
    }

    filePaths.forEach(this.uploadDistFile.bind(this));

    return Promise.resolve();
  },

  fileType: function(filePath) {
    var extension = path.extname(filePath);

    var type = this.fileTypes[extension] || '';

    return type;
  },

  uploadDistFile: function(filePath) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      var publisher = new S3Publisher({
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
        S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
        S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
        ui: this.ui
      });
      var relativeFilePath = filePath.replace(this.distDirectory, '');

      publisher.uploadFile(filePath, this.fileType(filePath), relativeFilePath);
    }
  }
};
