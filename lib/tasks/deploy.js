'use strict';

var S3Publisher = require('ember-publisher');

module.exports = function(env, project) {
  var publisher = new S3Publisher({
    project: 'ember',
    S3_BUCKET_NAME: 'myBucket',
    S3_SECRET_ACCESS_KEY: 's3-secret-access-key',
    S3_ACCESS_KEY_ID: 's3-access-key'
  });

  publisher.publish();
};
