# Monoexpress API
**MOngoNOdeEXPRESS**

NodeJS Module to create an API with CRUD methods, based on Express and Mongoose. This module allows you to create an API to test something in a few minutes, and it is only needed to have a MongoDB database and NodeJS installed.

Written in Javascript, following the [ES5 Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript/tree/master/es5#the-javascript-style-guide-guide).

This is an alpha version, so feel free to contribute if you want to make it better. Pull requests are welcome!

**Getting started**
--------------------
Check the [Getting Started wiki page](https://github.com/jesusbotella/NodeSimpleAPI/wiki/Getting-Started) to see a brief tutorial about the module

**Quick Example**
--------------------

    var API = require('monoexpress');

    API.setMongoDBURL('YOUR_MONGO_URL');

    // Mongoose Schema Model
    // http://mongoosejs.com/docs/guide.html
    var userModel = {
      name: String,
      address: String
    };

    API.registerEndpoints('users', userModel);

    API.listen();

**API Reference**
--------------------
- [`registerEndpoints(String name, Object mongooseSchema [, Function authentication])`](#registerendpointsstring-name-object-mongooseschema--function-authentication)
- [`setMongoDBURL(String mongoDBURL)`](#setmongodburlstring-mongodburl)
- [`listen(Integer port)`](#listeninteger-port)

#####`registerEndpoints(String name, Object mongooseSchema [, Function authentication])`
Creates the Mongoose model, and registers the new API routes which will be exposed. You can pass an authentication function, like the ones used in Express, as the last parameter to control the access of all the routes included in this endpoint.

Routes registered:

    GET /<name>
    Retrieves all the documents within the collection

    POST /<name>/add
    Creates a new document in the collection using the data included in the POST request

    GET /<name>/<document_id>
    Returns the desired document

    POST /<name>/<document_id>/update
    Updates the properties of the selected document with the properties included in the POST request.

    DELETE /<name>/<document_id>
    Deletes the selected document

#####`setMongoDBURL(String mongoDBURL)`
Sets the MongoDB Database URL property, needed to initialize the API server.

#####`listen(Integer port)`
Makes the API available to handle all the requests, listening in the desired port passed as an argument. Otherwise, it will listen to requests at the port 3000.

**Developed by**
--------------------
Jesús Botella · jesus.botella@gmail.com

[![Twitter][2]][1] [![LinkedIn][4]][3]

  [1]: http://twitter.com/sn00b
  [2]: https://github.com/jesusbotella/PebbleBiciMAD/blob/master/social_icons/twitter.png?raw=true
  [3]: https://linkedin.com/in/jesusbotella
  [4]: https://github.com/jesusbotella/PebbleBiciMAD/blob/master/social_icons/linkedin.png?raw=true
