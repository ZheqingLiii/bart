
const http = require('http');
var express = require('express');
var router = express.Router();
var request = require('request');
var app = require('./app');
var port = process.env.PORT || 3000;

/*
app.get('/', function(req, res) {
        res.send('Hello');
});
*/

app.listen(port);
console.log('Listening to %s', port);
