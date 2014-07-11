'use strict';

var path = require('path');
var deploy = require('../tasks/deploy');
var chalk = require('chalk');

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
      buildOptions.ui.pleasantProgress.start(chalk.green('Looking in ' + options.outputPath + ' for files.'), chalk.green('.'));

      return deploy.run(options.environment, options.outputPath, project, buildOptions.ui);
    }).finally(function() {
      buildOptions.ui.pleasantProgress.stop();
    });
  }
};
