// Dependencies
var express = require('express');
var app = express();
var colors = require('colors');
var stormpath = require('express-stormpath');

// Variables
var prepath = __dirname + "/public/html";
var host = "127.0.0.1";
var port = 3000;

// Set stuff for basic configurations
app.set('port', (process.env.PORT || port));
app.use(express.static(prepath));
app.set('views', prepath + "/pages");
app.use('/vendor', express.static(prepath + "/vendor"));

// Stormpath stuff
app.use(stormpath.init(app, {
    client: {
        apiKey: {
            file: __dirname + "/config/stormpath/apikey.properties"
        }
    },
    application: {
        href: "https://api.stormpath.com/v1/applications/4sasSt9CuuGAi6LjYR5KZQ"
    },
    web: {
        logout: {
            enabled: true
        }
    }
}));

// DIRECTORY HAS TO BE REOGRANIZED

// Landing page
app.get('/', stormpath.getUser, function(req, res) {
    console.log("Incoming request made by user: " + req.user.email);
	if (req.user) {
        console.log("200".green + " requested page " + req.url + " granted.");
        res.status(200);
        res.sendFile(prepath + "/pages/dashboard.html");
    } else {
        console.log("200".green + " requested page " + req.url + " granted.");
        res.status(200);
        res.sendFile(prepath + "/index.html");
    }
});

app.get('/secret', stormpath.authenticationRequired, function (req, res) {
  console.log("Secret page requested.");
  res.json(req.user);
});

// Account authentication
/*
app.get('/auth/google', function(req, res) {
    // Some stuff
});
app.get('/auth/google/callback', function(req, res) {
    // Some stuff
});
*/
// Everything else
/*
app.get(/^(.+)$/, function(req, res) { 
    console.log("200".green + " static file request : " + req.params);
    res.status(200);
    res.sendFile(prepath + req.params[0]); 
 });
*/

// If nothing matches, go 404
app.get('*', function(req, res) {
    console.log("404".red + " requested page " + req.url + " not found.");
    res.status(404);
    res.sendFile(prepath + "/notfound.html");
});

// Listen for requests
app.on('stormpath.ready', function() {
    app.listen(app.get('port'), function() {
        console.log("LISTENING".magenta + " on port " + app.get('port'));
    });
});
