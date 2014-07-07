'use strict';

module.exports = {
  name: 's3:deploy',
  description: 'Build the Ember project and deploy the assets to S3',
  works: 'insideProject',

  availableOptions: [
    { name: 'environment', type: String, default: 'development' }
  ],

  run: function(options) {
    return require('../tasks/deploy')(options.environment, this.project)();
  }
};
