var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

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

app.use(express.logger('dev'));
app.use(express.static('public'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'adsf4320v0a230a0agva0402350va023503a0v4q40' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// Poassport setup
var Account = require('./app/models/account'),
    LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// load the routes
require('./app/routes')(app);

module.exports = app;
