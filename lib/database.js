'use strict';

/**
 * Module dependencies.
 * @private
 */

var mongoose = require('mongoose');
var Promise = require('bluebird');
var debug = require('debug')('monoexpress:mongoose');
var _ = require('lodash');

/**
 * Module exports.
 * @public
 */
module.exports = Database;

/**
 * Database Class Constructor
 * @public
 */
function Database() {
  this.mongoose = mongoose;
};

/**
 * Connects Mongoose to MongoDB Database
 *
 * @param {string} MONGODB_URL
 * @public
 */

Database.prototype.connect = function connect(MONGODB_URL) {
  if (typeof MONGODB_URL === 'undefined' || MONGODB_URL === '') {
    throw new Error('MongoDB URL was not found. Use setMongoDBURL method to define it.');
  }

  mongoose.connect(MONGODB_URL);
};

/**
 * Registers the user created model to Mongoose
 * and creates CRUD model methods
 *
 *
 * @param {string} name
 * @param {object} schemaFields
 * @public
 */

Database.prototype.registerModel = function registerModel(name, schemaFields) {
  debug('%s: Registering model', name);
  var modelSchema = new mongoose.Schema(schemaFields);
  var populateFields = _getFieldsToPopulate(schemaFields);

  // CRUD specific schema methods
  modelSchema.statics.create = function(document) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this.collection.insert(document, function(err, result) {
          if (err) return reject(err);
          return resolve(result.ops[0]);
        }
      );
    });
  };

  modelSchema.statics.getAll = function() {
    var _this = this;

    return new Promise(function(resolve, reject) {
      var query = _this.find({});

      if (populateFields.length) {
        _populateQueryObject(query, populateFields);
      }

      query.exec(function(err, results) {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  };

  modelSchema.statics.get = function(id) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      var query = _this.findOne({ _id: id });

      if (populateFields.length) {
        query = _populateQueryObject(query, populateFields);
      }

      query.exec(function(err, result) {
        if (err) return reject(err);
        if (!result) return resolve({status: 404, message: 'Document not found'});
        return resolve(result);
      });
    });
  };

  modelSchema.statics.update = function(id, propertyUpdate) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      var query = _this.findOneAndUpdate({ _id: id }, propertyUpdate, { new: true });

      if (populateFields.length) {
        query = _populateQueryObject(query, populateFields);
      }

      query.exec(function(err, result) {
        if (err) return reject(err);
        if (!result) return resolve({status: 404, message: 'Document not found'});
        return resolve(result);
      });
    });
  };

  modelSchema.statics.delete = function(id) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      var query = _this.findByIdAndRemove(id);

      if (populateFields.length) {
        query = _populateQueryObject(query, populateFields);
      }

      query.exec(function(err, result) {
        if (err) return reject(err);
        if (!result) return resolve({status: 404, message: 'Document not found'});
        return resolve(result);
      });
    });
  };

  // Registers and return the created model
  return mongoose.model(name, modelSchema);
};

/**
 * Scans all fields of the model to search
 * references to other models
 *
 * @param {object} modelSchema
 * @private
 */

var _getFieldsToPopulate = function _getFieldsToPopulate(modelSchema) {
  var fields = [];

  _.forIn(modelSchema, function(value, key) {
    if (_.has(value, 'ref') || (_.isArray(value) && _.has(value[0], 'ref'))) {
      return fields.push(key);
    }
  });

  return fields;
};

/**
 * Sets the fields which need to
 * be populated in the query
 *
 * @param {object} query
 * @param {array} fields
 * @private
 */

var _populateQueryObject = function _populateQueryObject(query, fields) {
  for (var i = 0; i < fields.length; i++) {
    query.populate(fields[i]);
  }

  return query;
};
