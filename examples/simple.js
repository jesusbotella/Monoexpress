/*!
 * Monoexpress Example
 * Subdocument Autopopulation Example
 * Copyright(c) 2015 Jesús Botella
 * MIT Licensed
 */

var API = require('monoexpress');

API.setMongoDBURL('YOUR_MONGODB_URL');

// Mongoose Schema Model
// http://mongoosejs.com/docs/guide.html
var usersSchema = {
  name: String,
  address: String
};

// Register Endpoints
API.registerEndpoints('users', usersSchema);

API.listen();
