/**
 * Created by Athinodoros on 5/19/2017.
 */

var fs = require('fs');


function findCities(book, listOfCities) {
    var possibleCountryCodes = [];
    var citiesArray = book.cities.split(",");

    citiesArray.forEach(function (item, index, fullArray) {
        var innerArray = [];
        listOfCities.forEach(function (cityItem) {
            if (index > 0) {

                if (item == cityItem.name || item == cityItem.asciiname) {
                    innerArray.push(cityItem)
                }
            }
        })
        if (innerArray.length > 0)
            possibleCountryCodes.push(innerArray);
    })
    return possibleCountryCodes;

}

//
// function readBooksToObjects(fileLocation) {
//     var listOfBookItems = [];
//     var allbooks = fs.readFileSync(fileLocation);
//     allbooks.toString().split('\n').forEach(function (item, index, array) {
//         var line = item.split('\t');
//         if (line[0] == "filename") ;//skip the header line
//         else if (line[0] != "") {
//             var bookObject = {};
//             bookObject.filename = line[0];
//             bookObject.title = line[1];
//             bookObject.author = line[2];
//             bookObject.release_date = line[3];
//             bookObject.cities = line[4];
//             bookObject.language = line[5];
//             listOfBookItems.push(bookObject);
//         }
//     });
//     return listOfBookItems
// }

function countInArray(array, what) {
    var count = 0;
    // console.log(Object.prototype.toString.call(array))
    // if (Object.prototype.toString.call(array) == '[object Array]') return 0;
    array.forEach(function (item, index, array) {
        if (item.countryCode == what)
            count++
    });
    return count;
}

function isInArray(array, what) {
    var count = 0;
    array.forEach(function (item, index, array) {
        if (item.name == what)
            count++
    });
    return count;
}

function flaten(arrayOfArrays, book) {
    var distinctItems = [];
    var flatArray = [];
    if (arrayOfArrays.length < 1) return cityCounterAndProbCalc(null, null, null, book)
    if (arrayOfArrays)
        arrayOfArrays.forEach(function (item) {
            item.forEach(function (innerItem) {
                if (countInArray(distinctItems, innerItem.countryCode) == 0) {
                    distinctItems.push(innerItem)
                }
                flatArray.push(innerItem)
            })
        })
    else {
        callback(null, distinctItems, arrayOfArrays, book)
    }


    return cityCounterAndProbCalc(flatArray, distinctItems, arrayOfArrays, book)
}

function cityCounterAndProbCalc(bigArray, smallArray, compactArray, book) {
    if (!bigArray) {
        return book;
    }
    var countInArrayResults = [];
    smallArray.forEach(function (distItem) {
        var singleResult = {};
        singleResult = distItem;
        singleResult.occurances = countInArray(bigArray, distItem.countryCode);
        countInArrayResults.push(singleResult);
    })
    countInArrayResults.sort(function (a, b) {
        return a.occurances <= b.occurances ? 1 : -1;
    })
    var newFixedArray = [];
    if (compactArray.length > 0)
        compactArray.forEach(function (array, listIndex, compact) {

            if (array.length == 1) {


                if (isInArray(newFixedArray, array[0].name) <= 0)
                    newFixedArray.push(array[0]);
            } else if (compact.length > 2) {
                //start checking neighbors
                //check if in neighbors for each
                array.forEach(function (city, index, cArray) {

                    var areInNeigbors = [];
                    if (listIndex == 0 && compactArray.length > 1) {//if first item check next two
                        if (countInArray(compactArray[listIndex + 1], city.countryCode) > 0 &&
                            countInArray(compactArray[listIndex + 2], city.countryCode) > 0) {
                            city.hadNeighbors = true;
                            if (areInNeigbors.indexOf(city) < 0)
                                areInNeigbors.push(city);
                        } else {
                            cArray.sort(function (a, b) {
                                a.population < b.population ? 1 : -1
                            })
                            if (isInArray(newFixedArray, cArray[0].name) <= 0) {
                                newFixedArray.push(cArray[0])

                            }
                        }
                    } else if (listIndex == compactArray.length && compact.length > 1) {//if first item check previews two

                        if (countInArray(compactArray[listIndex - 1], city.countryCode) > 0 &&
                            countInArray(compactArray[listIndex - 2], city.countryCode) > 0) {
                            city.hadNeighbors = true;
                            if (isInArray(areInNeigbors, city.name) <= 0)
                                areInNeigbors.push(city);
                        } else {

                            cArray.sort(function (a, b) {
                                a.population < b.population ? 1 : -1
                            })
                            if (isInArray(newFixedArray, cArray[0].name) <= 0) {

                                (cArray[0])

                            }
                        }
                    }
                    else {//if first item check next previews one
                        if (compactArray.length > 1)
                            try {
                                if (countInArray(compactArray[listIndex - 1], city.countryCode) > 0 &&
                                    countInArray(compactArray[listIndex + 1], city.countryCode) > 0) {
                                    city.hadNeighbors = true;
                                    if (isInArray(newFixedArray, city.name) <= 0)
                                        newFixedArray.push(city);
                                } else {
                                    cArray.sort(function (a, b) {
                                        a.population < b.population ? 1 : -1
                                    })
                                    if (isInArray(newFixedArray, cArray[0].name) <= 0) {
                                        newFixedArray.push(cArray[0])

                                    }
                                }
                            }catch (err){

                            // console.log(compactArray.length)
                            // console.log(compactArray.length)
                            }
                    }
                    if (areInNeigbors.length >= 1) {
                        var tempArr = cArray;
                        tempArr.sort(function (a, b) {//sort them by population (most first)
                            return a.population < b.population ? 1 : -1;
                        })
                        if (countInArray(areInNeigbors, tempArr[0].countryCode) <= 0) {
                            areInNeigbors.push(tempArr[0])
                        }
                        if (areInNeigbors.length >= 1) {
                            areInNeigbors.sort(function (a, b) {//sort them by population (most first)
                                return a.population < b.population ? 1 : -1;
                            })

                            if (isInArray(newFixedArray, areInNeigbors[0].name) <= 0) {
                                newFixedArray.push(areInNeigbors[0])

                            }
                        }
                    }
                })

            }
        });

    book.cities = newFixedArray;
    return book;

}

// change so that it takes the bookitem as argument
// flaten(findCities(readBooksToObjects("./testbookContent.csv"), readCitiesToObjects("./../citiesEXT.csv")), readBooksToObjects("./testbookContent.csv")[0], cityCounterAndProbCalc);

module.exports = {
    findCities: findCities,
    findCorrectCity: flaten,
    cityCallBack: cityCounterAndProbCalc
}