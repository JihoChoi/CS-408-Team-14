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
var auth = require(__dirname + '/config/auth.js').googleAuth;

// Connect to database
mongoose.connect('mongodb://application:coconutWatr@ds153179.mlab.com:53179/coconutwatr');

//Import database schema and functions; call functions with dbFunc.*functionName*(args);
var Student = require("./server/schema/student.js");
var Event = require("./server/schema/event.js");
var Group = require("./server/schema/group.js");
var Class = require("./server/schema/class.js");
var Invite = require("./server/schema/invite.js");
var User = require("./server/schema/user.js");
var db = require("./server/db.js");

// Setup server
app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + "/public"));
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/public/views/'}));
app.set('views', __dirname + "/public/views");
app.set('view engine', 'hbs');
app.use('/vendor', express.static(__dirname + "/public/vendor"));
app.use(require('cookie-parser')());
app.use(bodyparser.json());         // Support JSON-encoded bodies
app.use(bodyparser.urlencoded({     // Support URL-encoded bodies
    extended: true
}));

// User management
passport.use(new googleStrategy({
	clientID: auth.id,
	clientSecret: auth.secret,
	callbackURL: auth.callback
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
  done(null, user);
});
function loginVerify(req, res, next) {
	if (req.user) {
		next();
	} else {
		res.redirect('/login');
	}
};

/**
 * GET REQUESTS
 */

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
app.get('/', function(req, res) {
	if (req.user) {
		db.enrollUser(req.user.email, function () {
            db.getUserCourses(req.user.email, function(courses) {
                // console.log("courses :" + courses);
				res.status(200);
                res.render("dashboard", {
                    user: req.user,
                    courses: courses
                });
				console.log('200'.green+ " " + req.user.email +" requested " + req.url);
            });
        });
	} else {
        res.status(200);
		res.render('index', {
			layout: false
		});
		console.log('200'.green+ " guest requested " + req.url);
	}
});

// Login attempt & callback
app.get('/login', passport.authenticate('google', { scope: ['profile'] }));
app.get('/callbacks/google', passport.authenticate('google', { failureRedirect: '/loginerror' }),
	function(req, res) {
		console.log("Callback received.");
		console.log(req.user);
		res.redirect('/');
	}
);

// Get other pages
// app.get({page}. loginVerify, function (req, res)

app.listen(app.get('port'), function() {
	console.log('LISTENING'.magenta + ' on port ' + app.get('port'));
});

module.exports = app;