// Connect to database
var mongoose = require('mongoose');
mongoose.connect('mongodb://application:coconutWatr@ds153179.mlab.com:53179/coconutwatr');

//Import database schema and functions; call functions with dbFunc.*functionName*(args);
var Student = require('./server/schema/student.js');
var Event = require('./server/schema/event.js');
var Group = require('./server/schema/group.js');
var Class = require('./server/schema/class.js');
var Invite = require('./server/schema/invite.js');
var User = require('./server/schema/user.js');
var db = require('./server/db.js');


db.addClass('testwow', 'Fall 2017', 'class name wow', 'description such wow','user@test');

var exec = require('child_process').exec;
var cmd = 'curl -L http://localhost:3000/course/testwow';

exec(cmd, function(error, stdout, stderr) {
	var classcode=stdout.search('testwow');
	var classsemester=stdout.search('Fall 2017');
	var classname=stdout.search('class name wow');
	var em=stdout.search('user@test');
	if (classcode > -1 & classsemester > -1 & classname > -1 & em > -1){
    	console.log('pass');
	}
	else {
    	console.log('fail');
	}
});