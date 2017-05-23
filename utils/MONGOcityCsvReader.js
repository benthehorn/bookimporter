
var fs = require("fs");
// Bring Mongoose into the app
var mongoose = require( 'mongoose' );
var Promise = require('promise');

// Build the connection string
var dbURI = 'mongodb://localhost:27017/bookImport';

// Create the database connection
mongoose.Promise = global.Promise;
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
var City = require('../models/city');


function readCitiesToObjects(fileLocation) {
    mongoose.connect('mongodb://localhost:27017/bookImport');
    var listOfCityItems = [];
    var allCities = fs.readFileSync(fileLocation);
    allCities.toString().split('\n').forEach(function (item, index, array) {
        var line = item.split('\t');
        if (line[0] == "filename" || line[3] || line[2] === null) ;//skip the header line

            var cityObject = {};
            cityObject.name = line[0];
            cityObject.asciiname = line[1];
            cityObject.loc = [line[2], line[3]];
            cityObject.countrycode = line[4];
            cityObject.population = line[5];
            var city = new City(cityObject);
            city.save(function(err, city) {
                if(err) return console.log(err.message);
                console.log('added');
            });

    });
}

readCitiesToObjects('.././citiesEXT.csv');