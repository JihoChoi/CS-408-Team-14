var mongoose = require('mongoose');
mongoose.connect('mongodb://application:coconutWatr@ds153179.mlab.com:53179/coconutwatr');
var Student = require("./schema/student.js");
var Event = require("./schema/event.js");
var Group = require("./schema/group.js");
var Class = require("./schema/class.js");
var Invite = require("./schema/invite.js");
var db = require("./db.js");
db.enrollUser("test@test", function() {


db.getStudent("test@test", function(student){console.log(student);
console.log("Expected Output: {email: test@test, courses:[], events:[], subgroups:[], invites: []}");
db.addClass("test101", "fall 2017", "testing stuff", "test@test");
db.getUserCourses("test@test", function(stuff){console.log(stuff);
console.log("Expected Output: [test101]");
db.classAddEvent("test event", "test event", "test", "test101", Date.now());
db.getEvent("test event", function(event){
	db.eventAddStudent("test@test",event);
	setTimeout(function(){
	db.getUserEvents("test@test", function(stuff1){console.log(stuff1);});
	console.log("Expected Output: [test event]");
	}, 1000);
	db.eventRemoveStudent(event,"test@test");
	setTimeout(function(){
	db.getUserEvents("test@test", function(stuff2){console.log(stuff2);
	console.log("Expected Output: []");
	});
}, 1000);


db.classAddGroup("test group", "test101", "test@test");
setTimeout(function(){
db.getGroup("test group", function(group) {
	db.groupAddStudent("test@test",group);
	setTimeout(function(){
	db.getUserGroups("test@test", function(stuff3){console.log(stuff3);
	console.log("Expected Output: [{name: test group}]");
	});
}, 1000);
	db.groupRemoveStudent(group,"test@test");
	setTimeout(function(){
	db.getUserGroups("test@test", function(stuff4){console.log(stuff4);
	console.log("Expected Output: []");
	});
}, 1000);
db.getStudent("test@test", function(student1){
	student1.courses = [];

db.getClass("test101", function(course){
	course.remove();



});
});
});
}, 1000);

});
});
});
console.log("done");
});
