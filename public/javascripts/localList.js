var express = require('express');
var router = express.Router();
const updated = null
//true false to check if it was online last time page was accessed
let total = 0
//value 0 -> 20 | counts number of files in memory

let item = {
    image: "missing",
    date: 15,
    id: "bird_name",
    name: "Person"
}

//Added basic functions to store a line of a database locally
storeItem = function (itemNum, item) {
    localStorage.setItem(itemNum, JSON.stringify(item))
}

getItem = function (itemNum){
    const data = localStorage.getItem(itemNum)
    item = JSON.parse(data)
}