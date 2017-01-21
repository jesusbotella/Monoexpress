'use strict';

/**
 * Module dependencies.
 * @private
 */

var _ = require('lodash');
var debug = require('debug')('monoexpress:express');
var express = require('express');
var http = require('http');

/**
 * Module exports.
 * @public
 */

module.exports  = API;

/**
 * Initialize and configure the new Express server
 *
 * Options:
 *
 * @param {object} options
 * @public
 */

function API(options) {
  var opts = options || {};

  // Load all express-required modules
  var logger = require('morgan');
  var bodyParser = require('body-parser');

  this.app = express();

  // Set up Express logger
  this.app.use(logger('dev'));

  // Express BodyParser
  this.app.use(bodyParser.json());
  this.app.use(bodyParser.urlencoded({ extended: false }));
};

/**
 * Initialize and configure the new Express server
 *
 * @param {integer} port
 * @public
 */

API.prototype.listen = function listen(port) {
  var server = http.createServer(this.app);
  server.listen(port || 3000);

  console.log('Ready to use at 0.0.0.0:' + (port || 3000));
};

/**
 * Registers endpoints of the given model name and
 * attaches them to the main express router
 *
 * @param {string} name
 * @param {function} authentication
 * @public
 */

API.prototype.registerEndpoints = function registerEndpoints(name, authentication) {
  // Register created routes
  this.app.use('/' + name, this.registerModelRoutes(name, authentication));
};

/**
 * Registers the routes needed to obtain
 * model data through the API
 *
 * @param {string} name
 * @param {function} authentication
 * @public
 */

API.prototype.registerModelRoutes = function registerModelRoutes(name, authentication) {
  var router = express.Router();
  var model = require('mongoose').model(name);

  debug('%s: Registering routes', name);

  if (typeof authentication === 'function') {
    router.use(authentication);
  } else if (typeof authentication !== 'undefined' && typeof authentication !== 'function') {
    throw new Error('The authentication method needs to be a function');
  }

  router.get('/',
    function(req, res) {
      model.getAll().bind(res).then(_handleResponse);
    }
  );

  router.post('/',
    function(req, res) {
      if (_.isEmpty(req.body)) {
        return res.status(400).send('No properties were found');
      }

      model.create(req.body).bind(res).then(_handleResponse);
    }
  );

  router.get('/:id',
    function(req, res) {
      model.get(req.params.id).bind(res).then(_handleResponse);
    }
  );

  router.patch('/:id',
    function(req, res) {
      model.update(req.params.id, req.body).bind(res).then(_handleResponse);
    }
  );

  router.delete('/:id',
    function(req, res) {
      model.delete(req.params.id).bind(res).then(_handleResponse);
    }
  );

  // ROUTES FOR PREVIOUS COMPATIBILITY
  router.post('/add',
    function(req, res) {
      if (_.isEmpty(req.body)) {
        return res.status(400).send('No properties were found');
      }

      model.create(req.body).bind(res).then(_handleResponse);
    }
  );

  router.post('/:id/update',
    function(req, res) {
      model.update(req.params.id, req.body).bind(res).then(_handleResponse);
    }
  );

  return router;
};

/**
 * Registers the API error handlers
 * @public
 */

API.prototype.registerErrorHandlers = function() {
  // 404 Route Error Handler
  this.app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Development Express Error Catcher
  if (this.app.get('env') === 'development') {
    this.app.use(function(err, req, res, next) {
      res
      .status(err.status || 500)
      .send({ error: err, message: err.message});
    });
  }

  // Production Express Error Catcher
  this.app.use(function(err, req, res, next) {
    res.status(err.status || 500).send();
  });
};

/**
 * Send the appropiate response depending on if
 * it is an error or not
 *
 * @param {object} reponse
 * @private
 */

var _handleResponse = function _handleResponse(response) {
  debug('_handleResponse', response);

  if (response.status && response.message) {
    return this.status(response.status).send(response.message);
  } else {
    return this.send(response);
  }
};
