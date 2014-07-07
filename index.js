'use strict';

var commands   = require('./lib/commands');

function EmberCLIS3(project) {
  this.project = project;
  this.name    = 'Ember CLI S3';
  this.setConfig();
}

EmberCLIS3.prototype.includedCommands = function() {
  return commands;
};

EmberCLIS3.prototype.setConfig = function(){
  if(!this.config) {
    this.config = {};
  }
};

module.exports = EmberCLIS3;
