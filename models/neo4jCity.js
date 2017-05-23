/**
 * Created by Rihards on 18/05/2017.
 */
'use strict';

const City = module.exports = function (cityObj) {
    const city = cityObj.properties;
    this.name = city.name;
    this.asciiname = city.asciiname;
    this.loc = city.loc;
    this.countryCode = city.countryCode;
};