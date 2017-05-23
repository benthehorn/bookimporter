/**
 * Created by Athinodoros on 5/19/2017.
 */
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
var Book = require('../models/book');

function readBooksToObjects(fileLocation) {
    var listOfBookItems = [];
    var allbooks = fs.readFileSync(fileLocation);
    allbooks.toString().split('\n').forEach(function (item, index, array) {
        var line = item.split('\t');
        if (line[0] == "filename") ;//skip the header line
        else {
            var bookObject = {};
            bookObject.filename = line[0];
            bookObject.title = line[1];
            bookObject.author = line[2];
            bookObject.release_date = line[3];
            bookObject.cities = line[4];
            bookObject.language = line[5];
            var book = new Book(bookObject);
            book.save(function(err, book) {
               if(err) return console.log(err.message);
                console.log('added');
            });
        }
    })
    return listOfBookItems
}

readBooksToObjects('.././bookContent.csv');






