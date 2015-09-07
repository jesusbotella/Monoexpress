var mongoose = require('mongoose');
var Promise = require('bluebird');
var debug = require('debug')('simple-api:mongoose');

var connect = function(mongodbURL) {
  if (typeof mongodbURL === 'undefined' || mongodbURL === '') {
    throw new Error('MongoDB URL is not defined. Use setMongoDBURL method to define it.');
  }

  mongoose.connect(mongodbURL);
};

var registerModel = function(name, schemaFields) {
  debug('%s: Registering model', name);
  var modelSchema = new mongoose.Schema(schemaFields);

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
      _this.find({})
      .exec(function(err, results) {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  };

  modelSchema.statics.get = function(id) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this.findOne({ _id: id })
      .exec(function(err, result) {
        if (err) return reject(err);
        if (!result) return resolve({status: 404, message: 'No item found'});
        return resolve(result);
      });
    });
  };

  modelSchema.statics.update = function(id, propertyUpdate) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this.findOneAndUpdate({ _id: id }, propertyUpdate, { new: true })
      .exec(function(err, result) {
        if (err) return reject(err);
        if (!result) return resolve({status: 404, message: 'No item found'});
        return resolve(result);
      });
    });
  };

  modelSchema.statics.delete = function(id) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this.findByIdAndRemove(id)
      .exec(function(err, result) {
        if (err) return reject(err);
        if (!result) return resolve({status: 404, message: 'Document not found'});
        return resolve(result);
      });
    });
  };

  // Register and return the created model
  return mongoose.model(name, modelSchema);
};

module.exports = {
  connect: connect,
  registerModel: registerModel,
};
