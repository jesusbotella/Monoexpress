# Monoexpress API
**MOngoNOdeEXPRESS**

NodeJS Module to create an API with CRUD methods, based on Express and Mongoose. This module allows you to create an API to whatever you want to do in a few minutes, and it is only needed to have a MongoDB database and NodeJS installed.

Monoexpress builds the Mongoose model and creates the endpoints to fetch, add, update, or delete documents inside a MongoDB Collection without any effort. Intended for small DIY projects or to test anything that needs an API.

Written in Javascript, following the [ES5 Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript/tree/master/es5#the-javascript-style-guide-guide).

This is an alpha version, so feel free to contribute if you want to make it better. Pull requests are welcome!

**Getting started**
--------------------
Check the [Getting Started wiki page](https://github.com/jesusbotella/NodeSimpleAPI/wiki/Getting-Started) to see a brief tutorial about the module

**How it works**
--------------------

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
*You can check more examples out [here](https://github.com/jesusbotella/Monoexpress/tree/master/examples)*

**After that, you can make requests to these API methods:**

`GET /<name>`  
`Retrieves all the documents within the collection`

`POST /<name>/add`  
`Creates a new document in the collection using the data included in the POST request`

`GET /<name>/<document_id>`  
`Returns the desired document`

`POST /<name>/<document_id>/update`  
`Updates the properties of the selected document with the properties included in the POST request.`

`DELETE /<name>/<document_id>`  
`Deletes the selected document`

*The express and mongoose objects are available as well in the API object, with 'express' and 'mongoose' object keys respectively.*

**API Reference**
--------------------
- [`registerEndpoints(String name, Object mongooseSchema [, Function authentication])`](#registerendpointsstring-name-object-mongooseschema--function-authentication)
- [`setMongoDBURL(String mongoDBURL)`](#setmongodburlstring-mongodburl)
- [`listen(Integer port)`](#listeninteger-port)

#####`registerEndpoints(String name, Object mongooseSchema [, Function authentication])`
Creates the Mongoose model, and registers the new API routes which will be exposed. You can pass an authentication function, like the ones used in Express, as the last parameter to control the access of all the routes included in this endpoint.

#####`setMongoDBURL(String mongoDBURL)`
Sets the MongoDB Database URL property, needed to initialize the API server.

#####`listen(Integer port)`
Makes the API available to handle all the requests, listening in the desired port passed as an argument. Otherwise, it will listen to requests at port 3000.

**Latest version added features**
--------------------
* 1.0.3 Subdocument autopopulation

**Developed by**
--------------------
Jesús Botella · jesus.botella@gmail.com

[![Twitter][2]][1] [![LinkedIn][4]][3]

  [1]: http://twitter.com/sn00b
  [2]: https://github.com/jesusbotella/PebbleBiciMAD/blob/master/social_icons/twitter.png?raw=true
  [3]: https://linkedin.com/in/jesusbotella
  [4]: https://github.com/jesusbotella/PebbleBiciMAD/blob/master/social_icons/linkedin.png?raw=true
