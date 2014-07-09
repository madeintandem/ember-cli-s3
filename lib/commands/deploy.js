'use strict';

var path = require('path');
var deploy = require('../tasks/deploy');

module.exports = {
  name: 's3:deploy',
  description: 'Build the Ember project and deploy the assets to S3',
  works: 'insideProject',

  availableOptions: [
    { name: 'environment', type: String, default: 'development' },
    { name: 'output-path', type: path, default: 'dist/' }
  ],

  run: function(options) {
    var project = this.project;

    var buildOptions = {
      ui: this.ui,
      analytics: this.analytics
    };
    var BuildTask = this.tasks.Build;
    var build = new BuildTask(buildOptions);

    return build.run({
      environment: options.environment,
      outputPath: options.outputPath
    }).then(function() {
      return deploy.run(options.environment, project);
    });
  }
};
