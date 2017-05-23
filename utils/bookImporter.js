/**
 * Created by Athinodoros on 5/22/2017.
 */
var bookCsvReader = require("./MONGObookCsvReader");
var cityCsvReader = require("./MONGOcityCsvReader");
var bookCityFix = require("./cityLocator");
var mongoose = require('mongoose');
var Book = require('.././models/book');
var City = require('.././models/city');
var fs = require('fs');
var path = require('path'), fs = require('fs');
var jsonfile = require('jsonfile');
var file = 'bookjson.json';

var books = bookCsvReader.readBooksToObjects(".././bookContent.csv");
var cities = cityCsvReader.readCitiesToObjects(".././citiesEXT.csv");
var count = 0;
function doAllBooks() {
    var fixedBooksArray = [];
    console.log(books.length)
    console.log(cities.length)
    var beg = new Date();
    books.forEach(function (book, index, bookArray) {
        if (book.cities.length==0) {
            console.log(count);
            count ++;
        } else {

            var tempBook = bookCityFix.findCorrectCity(bookCityFix.findCities(book, cities), book, bookCityFix.cityCallBack)

            fs.appendFileSync('./bookjson.json', JSON.stringify(tempBook, null, 2));
            console.log('books saved' , fixedBooksArray.length);
            var end = new Date();

            if (fixedBooksArray.length % 50 == 0) {
                console.log(end - beg)
                // console.log(fixedBooksArray.length)
                console.log(fixedBooksArray.length +" "+index)

            }
        }
    })

    console.log(fixedBooksArray)
}

doAllBooks()