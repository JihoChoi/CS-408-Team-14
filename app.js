// Dependencies
var express = require('express');
var app = express();
var colors = require('colors');
var stormpath = require('express-stormpath');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var path = require('path');
var hbs = require('express-handlebars');


//Connect to mongodb
mongoose.connect('mongodb://application:coconutWatr@ds153179.mlab.com:53179/coconutwatr');

//Import database schema and functions; call functions with dbFunc.*functionName*(args);
var Student = require("./server/schema/student.js");
var Event = require("./server/schema/event.js");
var Group = require("./server/schema/group.js");
var Class = require("./server/schema/class.js");
var Invite = require("./server/schema/invite.js");
var db = require("./server/db.js");

// Variables
var prepath = __dirname + "/public";
var host = "127.0.0.1";
var port = 3000;

// Set stuff for basic configurations
app.set('port', (process.env.PORT || port));
app.use(express.static(prepath));
// app.set('view engine', "jade");
// app.set('views', prepath + '/pages')

// view engine setup handlebars
app.engine('hbs',hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/public/views/'}));
app.set('views', path.join(prepath, '/views'));
app.set('view engine', 'hbs');

// rendering engin jade -> handlebars
//  Jiho Choi


app.use('/vendor', express.static(prepath + "/vendor"));
app.use(bodyparser.json());         // Support JSON-encoded bodies
app.use(bodyparser.urlencoded({     // Support URL-encoded bodies
    extended: true
}));

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

// Helper function for 200
function send200(email, url, res) {
    console.log("200".green + " [" + email + "] \'" + url + "\'");
    res.status(200);
};

// Helper function for 404
function send404(email, url, res) {
    console.log("404".red + " [" + email + "] \'" + url + "\' not found.");
    res.status(404);
    res.render("notfound");
};


// GET REQUESTS

// Truncate html
app.get('/*.html', function(req, res) {
    res.redirect(req.url.slice(0, -5));
});

// Favicon.ico
app.get('/favicon.ico', function(req, res) {
    console.log("Sending favicon.ico as a file.");
    res.sendFile(__dirname + "/public/images/favicon.ico");
});

// Landing page
app.get('/', stormpath.getUser, function(req, res) {
	if (req.user) {
        db.enrollUser(req.user.email, function () {
            db.getUserCourses(req.user.email, function(courses) {
	    	console.log(courses);
                send200(req.user.email, req.url, res);
                res.render("dashboard", {
                    user: req.user,
                    courses: courses
                });
            });
        });
    } else {
        console.log("200".green + " requested page " + req.url + " granted.");
        res.status(200);
        res.render("index");
        // res.render("addClass");
    }
});

app.get('/index', function(req, res) {
    res.redirect('/');
});

app.get('/dashboard', function(req, res) {
    console.log("start rout dashboard");
    res.redirect('/');
});

app.get('/addClass', stormpath.authenticationRequired, function(req, res) {
    send200(req.user.email, req.url, res);
    res.render("addClass", {
        user: req.user
    });
});

// All events of user is in
app.get('/events', stormpath.authenticationRequired, function(req, res) {
    send200(req.user.email, req.url, res);
    res.render("events", {
        user: req.user
    });
});

// List of events in a subgroup
app.get('/course/*/*/events', stormpath.authenticationRequired, function(req, res) {
    var course = req.url.substr(8);
    var index = course.indexOf('/');
    var subgroup = course.substr(index);
    course = course.substr(0, index);
    index = subgroup.indexOf('/');
    subgroup = subgroup.substr(0, index);

    // Check if course exist/user has permission
    // Check if subgroup exist/user has permission

    send200(req.user.email, req.url, res);
    res.render("events", {
        user: req.user
    });
});

// Subgroup event page
app.get('/course/*/*/event/*', stormpath.authenticationRequired, function(req, res) {
    var course = req.url.substr(8);
    var index = course.indexOf('/');
    var subgroup = course.substr(index);
    course = course.substr(0, index);
    index = subgroup.indexOf('/');
    subgroup = subgroup.substr(0, index);
    index = subgroup.substr(index).indexOf('/');
    var event = subgroup.substr(index);

    if (event.indexOf('/') != -1)
        send400(req.user.email, req.url, res);
    else {
        // Check if course exist/user has permission
        // Check if subgroup exist/user has permission
        // Check if event exist/user has permission
    
        send200(req.user.email, req.url, res);
        res.render("event", {
            user: req.user,
            event: event
        });
    }
});

// List of events in a course
app.get('/course/*/events', stormpath.authenticationRequired, function(req, res) {
    var course = req.url.substr(8);
    if (course.indexOf('/') == -1) {
        // Course homepage

        // Lookup if class exist/user has permission

        send200(req.user.email, req.url, res);
        res.render("events", {
            user: req.user,
            course: course
        })
    } else {
        send400(req.user.email, req.url, res);
    }
});

// Course event page
app.get('/course/*/event/*', stormpath.authenticationRequired, function(req, res) {
    var course = req.url.substr(8);
    var index = course.indexOf('/');
    course = course.substr(0, index);
    var event = course.substr(index + 7);

    if (event.indexOf('/') != -1)
        send400(req.user.email, req.url, res);
    else {
        // Check if course exist/user has permission
        // Check if subgroup exist/user has permission
        // Check if event exist/user has permission
    
        send200(req.user.email, req.url, res);
        res.render("event", {
            user: req.user,
            event: event
        });
    }
});

/* TODO might want to check if the course for the url is existing */
/* in case of something like http://localhost:3000/course/notacourse */

app.get('/course/*', stormpath.authenticationRequired, function(req, res) {
    var course = req.url.substr(8);
    if (course.indexOf('/') == -1) {
        // Course homepage

        // Lookup if class exist/user has permission

        send200(req.user.email, req.url, res);
        res.render("class", {
            user: req.user,
            course: course
        })
    } else {
        send404(req.user.email, req.url, res);
    }
});

// Testing user session
app.get('/secret', stormpath.authenticationRequired, function (req, res) {
  console.log("Secret page requested by " + req.user.email);
  res.json(req.user);
});

// todo remove, I believe it is not needed anymore
// Quick fix of deprecated morris-data.js
// app.get('/data/morris-data.js', function(req, res) {
//     ;
// });


// POST REQUESTS
app.post('/join-class', stormpath.authenticationRequired, function(req, res) {
    db.classAddStudent(req.body.coursename,
        req.user.email); // db stuff
});

app.post('/create-class', stormpath.authenticationRequired, function(req, res) {
    db.addClass(req.body.coursename,
        req.body.semester,
        req.body.fullCourseName,
        req.user.email); // db stuff
});


// If nothing matches, go 404
app.get('*', function(req, res) {
	send404(null, req.url, res);
});

// Listen for requests
app.on('stormpath.ready', function() {
    app.listen(app.get('port'), function() {
        console.log("LISTENING".magenta + " on port " + app.get('port'));
    });
});

module.exports = app;