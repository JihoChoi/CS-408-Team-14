var mongoose = require('mongoose');
mongoose.connect('mongodb://application:coconutWatr@ds153179.mlab.com:53179/coconutwatr', { config: { autoIndex: false } });

var Student = require("./schema/student.js");
var Event = require("./schema/event.js");
var Group = require("./schema/group.js");
var Class = require("./schema/class.js");
var Invite = require("./schema/invite.js");
var db = require("./db.js");

db.enrollUser("kate@purdue", function() {
	//db.addClass("classwww", "fall 2017", "testing timer", "kate@purdue");
	//db.getUserCourses("kate@purdue", function(stuff){
		//console.log(stuff);
		//db.classAddEvent("testWTF5", "event for testing timer", "test", "class123", Date.now());
		db.getEvent("testWTF5", function(event){
			console.log("event created at:" + event.startTime);
			console.log("event expire at:" + event.ttl);
			//db.eventAddStudent("kate@purdue",event);
			//db.getUserEvents("kate@purdue", function(stuff1){
			//	console.log(stuff1);
			//});
			//db.eventRemoveStudent(event,"kate@purdue");
		});
		db.getClass("classwww", function(course){
			console.log(course.name);
			console.log("class expire at: " + course.ttl);
		});
	//});
});