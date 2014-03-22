var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// DB
var mongoose = require('mongoose');

var database = require('./config/database')
mongoose.connect(database.url);
var conn = mongoose.connection
conn.on('error', console.error.bind(console, 'Database connection error:'));
conn.once('open', function callback () { console.log("Database connected.") });

// App
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// load the routes
require('./app/routes')(app);

module.exports = app;
