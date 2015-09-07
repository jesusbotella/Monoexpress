//Simple API imports
var webServer = require('./lib/express.js');
var database = require('./lib/mongoose.js');

// Internal info variables
var endpoints = [];

///////////////////////////////////
//    EXPRESS SERVER SETUP       //
///////////////////////////////////

// Load all express-required modules
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http');

var debug = require('debug')('simple-api');
debug('Initializing Simple API');

// Initialize express
var app = express();

// Set up Express logger
app.use(logger('dev'));

// Express BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

///////////////////////////////////
//   SIMPLE API MODULE METHODS   //
///////////////////////////////////

var init = function() {};

var registerEndpoint = function(name, fields, authentication) {
  database.registerModel(name, fields);
  app.use('/' + name, webServer.registerRoute(name, express, authentication));

  endpoints.push(name);
};

var setMongoDBURL = function(mongodbURL) {
  app.set('mongodb_url', mongodbURL);
};

var listen = function(port) {
  database.connect(app.get('mongodb_url'));

  webServer.registerErrorHandlers(app);

  var server = http.createServer(app);
  server.listen(port || 3000);

  _printServerInfo();

  console.log('Ready to use at', server.address());

};

var _printServerInfo = function() {
  debug('API Endpoints');
  endpoints.forEach(function(endpoint) {
    debug('\t' + endpoint.charAt(0).toUpperCase() + endpoint.substring(1));
    debug('\t\tGET /' + endpoint);
    debug('\t\tPOST /' + endpoint + '/add');
    debug('\t\tGET /' + endpoint + '/:id');
    debug('\t\tPOST /' + endpoint + '/:id/update');
    debug('\t\tDELETE /' + endpoint + '/:id');
  });
};

module.exports = {
  init: init,
  registerEndpoint: registerEndpoint,
  setMongoDBURL: setMongoDBURL,
  listen: listen,
  express: app,
  mongoose: mongoose
};
