var express = require('express');
/*var routes = require('./routes');
var spots = require('./routes/spots');
var http = require('http');
var path = require('path');

var mongo = require('mongodob');
var monk = require('monk');
var db = monk('lacalhost:27107/motoparking');
*/
var app = express();

app.use(express.static(__dirname));

app.listen(process.env.PORT || 3000);
app.use(express.logger());