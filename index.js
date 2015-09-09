/*!
 * Monoexpress
 * NodeJS Module to create an API with CRUD methods, based on Express and Mongoose.
 * Copyright(c) 2015 Jesús Botella
 * MIT Licensed
 */

// Module Wrapper Import
var APIServer = require('./lib/express.js');
var Database = require('./lib/mongoose.js');

// Debugging Setup
var debug = require('debug')('monoexpress');
debug('Initializing Monoexpress');

// Dependencies
var mongoose = require('mongoose');

// API Initialization
var API = new APIServer();

// Database Initialization
var DB = new Database();

// Configurable User Data
var userData = {
  MONGODB_URL: ''
};

/*!
 * Monoexpress Module Exposed Methods
 */

var registerEndpoints = function(name, fields, authentication) {
  DB.registerModel(name, fields);
  API.app.use('/' + name, API.registerModelRoutes(name, authentication));
};

var setMongoDBURL = function(MONGODB_URL) {
  userData.MONGODB_URL = MONGODB_URL;
};

var listen = function(port) {
  DB.connect(userData.MONGODB_URL);

  API.registerErrorHandlers();
  API.listen();
};

module.exports = {
  registerEndpoints: registerEndpoints,
  setMongoDBURL: setMongoDBURL,
  listen: listen,
  express: API.app,
  mongoose: mongoose
};
