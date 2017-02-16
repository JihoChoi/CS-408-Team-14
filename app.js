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
// app.set('views', prepath + "/pages");
app.use('/vendor', express.static(prepath + "/vendor"));

// Stormpath stuff
app.use(stormpath.init(app, {
    enableGoogle: true,
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



// Directories

// Favicon.ico
app.get('/favicon.ico', function(req, res) {
    console.log("Sending favicon.ico as a file.");
    res.sendFile(__dirname + "/public/icons/favicon.ico");
})

// Landing page
app.get('/', stormpath.getUser, function(req, res) {
	if (req.user) {
        console.log("200 ".green + req.user.email + " requested page " + req.url + " granted.");
        res.status(200);
        res.sendFile(prepath + "/pages/dashboard.html");
    } else {
        console.log("200".green + " requested page " + req.url + " granted.");
        res.status(200);
        res.sendFile(prepath + "/pages/index.html");
    }
});

// Testing user session
app.get('/secret', stormpath.authenticationRequired, function (req, res) {
  console.log("Secret page requested.");
  res.json(req.user);
});

// Quick fix of deprecated morris-data.js
app.get('/data/morris-data.js', function(req, res) {
    ;
});

// If nothing matches, go 404
app.get('*', function(req, res) {
    console.log("404".red + " requested page " + req.url + " not found.");
    res.status(404);
    res.sendFile(prepath + "/pages/notfound.html");
});



// Listen for requests
app.on('stormpath.ready', function() {
    app.listen(app.get('port'), function() {
        console.log("LISTENING".magenta + " on port " + app.get('port'));
    });
});
