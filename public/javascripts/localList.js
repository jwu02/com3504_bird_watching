var express = require('express');
var router = express.Router();
const updated = null
//true false to check if it was online last time page was accessed

let item = {
    image: "missing.jpg",
    date: 15,
    id: "bird_name",
    name: "Person"
}

//Added basic functions to store a line of a database locally
storeItem = function (itemNum, item) {
    localStorage.setItem(itemNum, JSON.stringify(item))
}

pullItem = function (itemNum){
    const data = localStorage.getItem(itemNum)
    item = JSON.parse(data)
}

/*
basic premise is to take basic info from the database and convert it into an "item"
this item is stored as a valued JSON.
If the user is not connected to the DB, the items should be pulled and read instead
Local storage apparently is able to work across pages within a html, so might work to add values when offline too
also lets us store and pull across different files

localstorage.removeItem(X) removes item with key X from storage
localstorage.clear() wipes all values stored within the storage
 */
