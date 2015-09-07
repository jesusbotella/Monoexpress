var _ = require('lodash');
var debug = require('debug')('simple-api:express');

var registerRoute = function registerRoute(name, express, authentication) {
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
      return model.getAll().bind(res).then(_handleResponse);
    }
  );

  router.post('/add',
    function(req, res) {
      if (_.isEmpty(req.body)) {
        res.status(400).send('No properties were found');
      }

      model.create(req.body).bind(res).then(_handleResponse);
    }
  );

  router.get('/:id',
    function(req, res) {
      model.get(req.params.id).bind(res).then(_handleResponse);
    }
  );

  router.post('/:id/update',
    function(req, res) {
      model.update(req.params.id, req.body).bind(res).then(_handleResponse);
    }
  );

  router.delete('/:id',
    function(req, res) {
      model.delete(req.params.id).bind(res).then(_handleResponse);
    }
  );

  return router;
};

var _handleResponse = function(response) {
  debug('_handleResponse', response);

  if (response.status && response.message) return this.status(response.status).send(response.message);
  else return this.send(response);
};

var registerErrorHandlers = function(app) {
  // 404 Route Error Handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Development Express Error Catcher
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res
      .status(err.status || 500)
      .send({ error: err, message: err.message});
    });
  }

  // Production Express Error Catcher
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).send();
  });
};

module.exports = {
  registerRoute: registerRoute,
  registerErrorHandlers: registerErrorHandlers
};
