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
    db.getUserGroups(user.emails[0].value, function(groups) {
        user.subgroups = groups;
        db.getUserCourses(user.emails[0].value, function(courses) {
            user.courses = courses.sort();
            db.getUserEvents(user.emails[0].value, function(events) {
                user.events = events;
                db.getUserInvites(user.emails[0].value, function(invites) {
                    user.invites = invites;
                    done(null, user);
                });
            });
        });
    });
});


/**
 * VERIFY USER'S PERMISSIONS
 */

function loginVerify(req, res, next) {
	next();
};

function courseVerify(req, res, next) {
    next();
};

function groupVerify(req, res, next) {
    next();
};

function eventCourseVerify(req, res, next) {
    var course = req.url.substr(8);
    if (course.indexOf('/') != -1) {
        var events = course.substr(course.indexOf('/') + 7);
        course = course.substr(0, course.indexOf('/'));
        db.getClass(course, function (course) {
            if (course.events && course.events.indexOf(events) != -1) {
                next();
                return;
            }
        });
    } else {
        console.log('event ' + events + ' does not exist in class ' + course);
        res.status(404);
        res.render('notfound', { url: req.url, layout: false });
        console.log('404'.red + ' ' + req.user.emails[0].value + ' requested ' + req.url);
        return;
    }
}

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
        var allCourse;
        db.getAllCourses(function(allCourses) {
            console.log(req.user.subgroups);
            res.status(200);            
            res.render('dashboard', {
                user: req.user,
                courses: req.user.courses,
                allcoursename: allCourses
            });
            console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
        });
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

    db.getAllCourses(function(all_courses) {
        all_courses.sort();
        console.log(all_courses);
        all_courses.forEach(function(c) {
            if (req.user.courses.indexOf(c) != -1)
                delete c;
        });


        res.render('manageCourses', {
            email: req.user.emails[0].value,
            courses: req.user.courses,
            all_courses: all_courses,
        });
        console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
    })
});

/* TODO might want to check if the course for the url is existing */
/* in case of something like http://localhost:3000/course/notacourse */


app.get('/course/*/addSubgroup', loginVerify, courseVerify, function(req, res) {
    var course = req.url.substr(8);
    course = course.substr(0, course.indexOf('/'));
    req.session.lastCourse = course;
    res.status(200);
    res.render('addSubgroup', {
        email: req.user.emails[0].value,
        courses: req.user.courses
    });
    console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
});

app.get('/course/*/event/*', loginVerify, eventCourseVerify, courseVerify, function(req, res) {
    var course = req.url.substr(8);
    if (course.indexOf('/') != -1) {
        var evnt = course.substr(course.indexOf('/') + 7);
        course = course.substr(0, course.indexOf('/'));
        req.session.lastCourse = course;
        req.session.eventurl = req.url;
        db.getClass(course, function(course) {
            db.getEvent(evnt, function(events) {
                res.status(200);
                console.log(course);
                console.log(events);
                res.render('events', {
                    user: req.user,
                    course: course,
                    evnt: events
                });
                console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
                return;
            });
        });
    } else {
        req.session.attemptedURL = req.url;
        res.redirect('/notpermitted');
    }
});

app.get('/course/*/createEvent', loginVerify, courseVerify, function(req, res) {
    var course = req.url.substr(8);
    course = course.substr(0, course.indexOf('/'));
    req.session.lastCourse = course;
    db.getClass(course, function(course) {
        res.status(200);
        res.render('createEvent', {
            email: req.user.emails[0].value,
            courses: req.user.courses,
            course: course
        });
    });
    console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
});

app.get('/course/*/*', loginVerify, courseVerify, groupVerify, function(req, res) {
    var course = req.url.substr(8);
    console.log('course: ' + course);
    if (course.indexOf('/') != -1) {
        var subgroup = course.substr(course.indexOf('/') + 1);
        course = course.substr(0, course.indexOf('/'));
        req.session.lastCourse = course;
        console.log('subgroup: ' + subgroup);
        console.log('user: ' + req.user.emails[0].value);
        db.getGroup(subgroup, function(group) {
            db.getClass(course, function(course) {
                res.status(200);
                res.render('subgroup', {
                    user: req.user,
                    courses: req.user.courses,
                    subgroup: group,
                    course: course
                });
                // console.log("this is course"+course);
                console.log('200'.green+ ' ' + req.user.emails[0].value + ' requested ' + req.url);
            });
        });
        return;
    }
    res.status(404);
    res.render('notfound', { url: req.url, layout: false });
    console.log('404'.red + ' ' + req.user.emails[0].value + ' requested ' + req.url);
});

app.get('/course/*', loginVerify, courseVerify, function(req, res) {
    var course = req.url.substr(8);
    if (course.indexOf('/') == -1) {
        req.session.lastCourse = course;
        db.getClass(course, function(course) {
	        db.getClassGroups(course.name, function(groups) {
                db.getClassEvents(course.name, function(events) {
                    res.status(200);
                    console.log(events);
                    res.render('course', {
                        user: req.user,
                        //courses: req.user.courses,
                        course: course,
                        groups: groups,
                        events: events
                    });
                //    console.log('200'.green + ' ' + req.user.emails[0].value + ' requested ' + req.url);
                })
            });
        });
    } else if (course.indexOf(course.length - 1) == '/') {
        res.redirect(req.url.substr(0, req.url.length - 1));
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
		chatserver: process.env.CHATSERVER || 'http://coconutchattr.herokuapp.com'
	});
});

app.get('/socket.io/*', function(req, res) {
	res.redirect(301, (process.env.CHATSERVER || 'http://coconutchattr.herokuapp.com') + req.url);
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
    db.addClass(
        req.body.create_course_name,
        req.body.semester,
        req.body.create_course_full_name,
        req.body.description,
        req.user.emails[0].value,
        function() {res.redirect('/course/' + req.body.create_course_name)} 
        );
});

app.post('/join-class', loginVerify, function(req, res) {
    console.log("join course request with course name: " + req.body.join_course_name)
    db.classAddStudent(
        req.body.join_course_name,
        req.user.emails[0].value,
        function() {res.redirect('/course/' + req.body.join_course_name)}
        ); // db stuff
    // res.redirect('/course/' + req.body.join_course_name);
    //res.redirect('/');
});

app.post('/delete-course', loginVerify, function(req, res) {
    db.classRemoveStudent(
        req.body.delete_course_name,
        req.user.emails[0].value,
        function() {res.redirect('/')}
    );
});

app.post('/create-subgroup', loginVerify, courseVerify, function(req, res) {
    db.classAddGroup(
        req.body.subName,
        req.session.lastCourse,
        req.user.emails[0].value,
        function() {res.redirect('/course/' + req.session.lastCourse)}
    );
});

app.post('/create-event', loginVerify, courseVerify, function(req, res) {
    // console.log("current user: " + req.user.emails[0].value);
    // console.log("create course: " + req.body.coursename + "/" + req.body.semester + "/" + req.body.fullcoursename);
    db.classAddEvent(
        req.body.eventName,
        req.body.eventDes,
        req.body.eventLocation,
        req.body.courseName,
        req.body.eventDate,
        req.user.emails[0].value,
        function() {res.redirect('/course/' + req.session.lastCourse)}
    );
});

app.post('/invite-group', loginVerify, courseVerify, function(req, res) {
    db.getStudent(req.user.emails[0].value, function(student) {
        db.createInvite(
            req.body.invited,
            req.body.group,
            function() {res.redirect('/')}
        );
    });
})

app.post('/accept-invite', loginVerify, function(req, res) {
    db.acceptInvite(req.body.invite);
    res.redirect('/');
})

app.post('/decline-invite', loginVerify, function(req, res) {
    db.declineInvite(req.body.invite);
    res.redirect('/');
});

app.post('/add-rsvp', loginVerify, function(req, res) {
    db.eventAddStudent(req.user.emails[0].value, req.body.invite,
        function() {res.redirect('/' + req.session.eventurl)}
    );
})

app.post('/remove-rsvp', loginVerify, function(req, res) {
    db.eventRemoveStudent(req.user.emails[0].value, req.body.invite,
        function() {res.redirect('/' + req.session.eventurl)}
    );
})

app.post('/create-post', loginVerify, courseVerify, function(req, res) {
    db.classAddPost(req.body.course_name, req.body.text_input,
        function() {res.redirect('/course/' + req.session.lastCourse)}
    );
});



// app.post('/post-note', loginVerify, courseVerify, function (req, res) {
//     db.classAddPost(req.body.cour, req.body.text-input);
//
// });




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
