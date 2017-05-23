'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
  name: {
    type: String
  },
  asciiname: {
    type: String
  },
  loc: {
    type: [Number],
    index: '2d'
  },
  countrycode: {
    type: String
  }
});



const City = mongoose.model('City', CitySchema);

module.exports = City;

// to add a location loc: { type: "Point", coordinates: [ longitude, latitude ] },
