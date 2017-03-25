// Dependencies
var express = require('express');
var app = express();
var colors = require('colors');
var passport = require('passport');
var googleStrategy = require('passport-google-oauth20').Strategy;
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var path = require('path');
var hbs = require('express-handlebars');
if (!process.env.googleclientid)
	require('dotenv').load(); // Avoiding conflicts with Heroku environment variables

// Connect to database
mongoose.connect('mongodb://application:coconutWatr@ds153179.mlab.com:53179/coconutwatr');

//Import database schema and functions; call functions with dbFunc.*functionName*(args);
var Student = require('./server/schema/student.js');
var Event = require('./server/schema/event.js');
var Group = require('./server/schema/group.js');
var Class = require('./server/schema/class.js');
var Invite = require('./server/schema/invite.js');
var User = require('./server/schema/user.js');
var db = require('./server/db.js');

// Setup server
app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/public/views/'}));
app.set('views', __dirname + '/public/views');
app.set('view engine', 'hbs');
app.use('/vendor', express.static(__dirname + '/public/vendor'));
app.use(require('cookie-parser')());
app.use(bodyparser.json());         // Support JSON-encoded bodies
app.use(bodyparser.urlencoded({     // Support URL-encoded bodies
    extended: true
}));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


// User management
passport.use(new googleStrategy({
	clientID: process.env.googleclientid,
	clientSecret: process.env.googleclientsecret,
	callbackURL: process.env.googlecallbackuri
},
function(accessToken, refreshToken, profile, cb) {
	return cb(null, profile);
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  	done(null, user);
});
passport.deserializeUser(function(user, done) {
    db.getUserCourses(user.emails[0].value, function(courses) {
        user.courses = courses;
        db.getUserEvents(user.emails[0].value, function(events) {
            user.events = events;
            db.getUserInvites(user.emails[0].value, function(invites) {
                user.invites = invites;
                done(null, user);
            });
        });
    });
});


/**
 * VERIFY USER'S PERMISSIONS
 */

function loginVerify(req, res, next) {
	if (req.user) {
		next();
	} else {
		req.session.returnTo = req.url;
		//console.log('Guest requested ' + req.url + ' without logging in.');
		res.redirect('/login');
	}
};

function enrollmentVerify(req, res, next) {
	//TODO: Check if user is enrolled in the class
	if (req.user) {
        var course = req.url.substr(8);
        if (course.indexOf('/') != -1) {
            course = course.substr(0, course.indexOf('/'));
        }
		// Check if enrolled
        if (req.user.courses.indexOf(course) < 0) {
            req.session.attemptedURL = req.url;
            res.redirect('/notpermitted');
            return;
        } else {
            next();
        }
	} else {
		req.session.returnTo = req.url;
		//console.log('Guest requested ' + req.url + ' without logging in.');
		res.redirect('/login');
	}
};

/**
 * DIRECTORY NAVIGATION
 * Error checking and navigation to User's pages
 */

// Truncate html
app.get('/*.html', function(req, res) {
    res.redirect(req.url.slice(0, -5));
});

// Favicon.ico
app.get('/favicon.ico', function(req, res) {
    console.log('Sending favicon.ico as a file.');
    res.sendFile(__dirname + '/public/images/favicon.ico');
});

// Landing page
app.get('/', function(req, res) {
	if (req.user) {
        // console.log('courses :' + courses);
        res.status(200);
        res.render('dashboard', {
            user: req.user,
            courses: req.user.courses
        });
        console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
	} else {
        res.status(200);
		res.render('index', {
			layout: false
		});
		console.log('200'.green+ ' guest requested ' + req.url);
	}
});

app.get('/index', function(req, res) {
    res.redirect('/');
});

app.get('/dashboard', function(req, res) {
    res.redirect('/');
});

// Manage Courses
app.get('/manageCourses', loginVerify, function(req, res) {
	res.status(200);
	res.render('manageCourses', {
		email: req.user.emails[0].value,
		courses: req.user.courses
	});
	console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
});



// createEvent
app.get('/createEvent', loginVerify, function(req, res) {
    res.status(200);
    res.render('createEvent', {
        email: req.user.emails[0].value,
        courses: req.user.courses
    });
    console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
});

// addSubgroup
app.get('/addSubgroup', loginVerify, function(req, res) {
    res.status(200);
    res.render('addSubgroup', {
        email: req.user.emails[0].value,
        courses: req.user.courses
    });
    console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
});



// All events of user is in
app.get('/events', loginVerify, function(req, res) {
    console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
    res.status(200);
    res.render('events', {
        user: req.user
    });
});

// List of events in a subgroup
app.get('/course/*/*/events', enrollmentVerify, function(req, res) {
    var course = req.url.substr(8);
    var index = course.indexOf('/');
    var subgroup = course.substr(index);
    course = course.substr(0, index);
    index = subgroup.indexOf('/');
    subgroup = subgroup.substr(0, index);
    console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
    res.status(200);
    res.render('events', {
        user: req.user
    });
});

// Subgroup event page
app.get('/course/*/*/event/*', enrollmentVerify, function(req, res) {
    var course = req.url.substr(8);
    var index = course.indexOf('/');
    var subgroup = course.substr(index);
    course = course.substr(0, index);
    index = subgroup.indexOf('/');
    subgroup = subgroup.substr(0, index);
    index = subgroup.substr(index).indexOf('/');
    var event = subgroup.substr(index);

    if (event.indexOf('/') != -1) {
    	res.status(404);
    	res.render('notfound', { url: req.url, layout: false });
        console.log('404'.red + ' ' + req.user.emails[0].value + ' requested ' + req.url);
    } else {
        // Check if course exist/user has permission
        // Check if subgroup exist/user has permission
        // Check if event exist/user has permission
    
        console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
        res.status(200);
        res.render('event', {
            user: req.user,
            event: event
        });
    }
});

// List of events in a course
app.get('/course/*/events', enrollmentVerify, function(req, res) {
    var course = req.url.substr(8);
    if (course.indexOf('/') == -1) {
        console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
        res.status(200);
        res.render('events', {
            user: req.user,
            course: course
        })
    } else {
    	res.status(404);
    	res.render('notfound', { url: req.url, layout: false });
        console.log('404'.red + ' ' + req.user.emails[0].value + ' requested ' + req.url);
    }
});

// Course event page
app.get('/course/*/event/*', enrollmentVerify, function(req, res) {
    var course = req.url.substr(8);
    var index = course.indexOf('/');
    course = course.substr(0, index);
    var event = course.substr(index + 7);

    if (event.indexOf('/') != -1) {
    	res.status(404);
    	res.render('notfound', { url: req.url, layout: false });
        console.log('404'.red + ' ' + req.user.emails[0].value + ' requested ' + req.url);
    } else {
        // Check if course exist/user has permission
        // Check if subgroup exist/user has permission
        // Check if event exist/user has permission
    
        console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
        res.status(200);
        res.render('event', {
            user: req.user,
            event: event
        });
    }
});

/* TODO might want to check if the course for the url is existing */
/* in case of something like http://localhost:3000/course/notacourse */

app.get('/course/*', enrollmentVerify, function(req, res) {
    var course = req.url.substr(8);
    if (course.indexOf('/') == -1) {
        res.status(200);
        res.render('course', {
            user: req.user,
            courses: req.user.courses,
            course: course
        });
        console.log('200'.green + ' ' + req.user.emails[0].value + ' requested ' + req.url);
    } else {
    	res.status(404);
    	res.render('notfound', { url: req.url, layout: false });
        console.log('404'.red + ' ' + req.user.emails[0].value + ' requested ' + req.url);
    }
});

app.get('/chat*', loginVerify, function(req, res) {
	var url = req.url.substr(6);
	var newurl = url.replace(/[^0-9a-zA-z]/gi, '');
	if (newurl != url) {
		res.redirect('/chat/' + newurl);
		return;
	}
    console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
	res.status(200);
	res.render('chat', {
		layout: false,
		room: url || 'global',
		email: req.user.emails[0].value,
		chatserver: process.env.CHATSERVER
	});
});

app.get('/socket.io/*', function(req, res) {
	res.redirect(301, process.env.CHATSERVER + req.url);
});

app.get('/notpermitted', function(req, res) {
    if (req.user)
        console.log('403'.yellow + ' ' + req.user.emails[0].value + ' attempted to access ' + req.session.attemptedURL);
    else {
        res.redirect('/');
        return;
    }
    res.status(403);
    res.render('notpermitted', {
        layout: false,
        url: req.session.attemptedURL
    });
    delete req.session.attemptedURL;
});


/**
 * POST REQUESTS
 */
app.post('/create-course', loginVerify, function(req, res) {
    // console.log("current user: " + req.user.emails[0].value);
    // console.log("create course: " + req.body.coursename + "/" + req.body.semester + "/" + req.body.fullcoursename);
    db.addClass(
        req.body.coursename,
        req.body.semester,
        req.body.fullcoursename,
        req.user.emails[0].value 
        );
    res.redirect('/course/' + req.body.coursename);
});

app.post('/join-class', loginVerify, function(req, res) {
    db.classAddStudent(
        req.body.coursename,
        req.user.email); // db stuff
    res.redirect('/course/' + req.body.coursename);
});

app.post('/delete-course', loginVerify, function(req, res) {
    db.deleteCourse(
        req.body.delete_course
    );
    res.redirect('/manageCourses');
});

app.post('/create-subgroup', loginVerify, function(req, res) {
    // console.log("current user: " + req.user.emails[0].value);
    // console.log("create course: " + req.body.coursename + "/" + req.body.semester + "/" + req.body.fullcoursename);
    db.addClass(
        req.body.subName,
        req.user.emails[0].value
    );
    res.redirect('/course/' + req.body.coursename);
});

app.post('/create-event', loginVerify, function(req, res) {
    // console.log("current user: " + req.user.emails[0].value);
    // console.log("create course: " + req.body.coursename + "/" + req.body.semester + "/" + req.body.fullcoursename);
    db.classAddEvent(
        req.body.eventName,
        req.body.eventDes,
        req.body.eventLocation,
        req.class.course.name,
        req.body.eventDate
        //req.user.emails[0].value
    );
    res.redirect('/course/*/events' + req.body.coursename);
});



/**
 * USER MANAGEMENT
 */

// Login attempt & callback
app.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/callbacks/google', passport.authenticate('google'), function(req, res) {
		// console.log('req.session.returnTo: ' + req.session.returnTo);
		var redirect = (req.session.returnTo || '/');
		delete req.session.returnTo;
		console.log('Redirecting ' + req.user.emails[0].value + ' to ' + redirect);
		res.redirect(redirect);
});

app.get('/appenddata', function(req, res) {
	db.getUserCourses(req.user.emails[0].value, function(courses) {
		req.user.courses = courses;
	})
	res.redirect('/');
})

app.get('/register', function(req, res) {
	res.redirect('/login');
})

// Logout attempt
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});


/**
 * DEVELOPER SECRET PAGES
 */
app.get('/database_viewer', loginVerify, function(req, res) {
	res.status(200);
	res.render('database_viewer', {
		user: req.user
	});
	console.log('200'.green + ' guest requested ' + req.url);
})


/** 
 * PAGE NOT FOUND
 */
// Send 404
app.get('*', function(req, res) {
	res.status(404);
    res.render('notfound', { url: req.url, layout: false });
	if (req.user) {
		console.log('404'.red + ' ' + req.user.emails[0].value + ' requested ' + req.url);
	} else {
		console.log('404'.red + ' guest requested ' + req.url);
	}
});


/**
 * START LISTENING FOR REQUESTS
 */
app.listen(app.get('port'), function() {
	console.log('LISTENING'.magenta + ' on port ' + app.get('port'));
});

module.exports = app;
