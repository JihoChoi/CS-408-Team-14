var mongoose = require('mongoose');
var Student = require("./schema/student.js");
var Event = require("./schema/event.js");
var Group = require("./schema/group.js");
var Class = require("./schema/class.js");
var Invite = require("./schema/invite.js");
var ObjectId = require('mongoose').Types.ObjectId; 

//DocumentArrays have a special id method for looking up a document by its _id
//link here: http://mongoosejs.com/docs/subdocs.html

//Usage: createUser("student email", callback function);
//Cretes a user and adds it to the database. Mostly a helper function. Use at your own discretion
var createUser = function(email, callback) {
	var student = new Student({
		email: email,
		courses: [],
		events: [],
		subgroups: [],
		invites: []
	});
	student.save(function(err){
		if(err) throw err;
		callback();
	});
};

//Usage: enrollUser("student email", callback function); **the callback function is only here so that the code doesn't continue before the user can be created, which would casue a crash
//Checks if a user exists, if it does do nothing, if it doesn't, creates it
var enrollUser = function(email,callback) {
	getStudent(email, function(student){
		if(student) {
		callback();
		} else {
		createUser(email, callback);
		}
	});
	
};

//Usage: addClass("class name", "semester", "full class name", "student email")
//Create a new class
var addClass = function(name, semester, fullName, email){
	getStudent(email,function(student){
		addClassHelp(name,semester,fullName,student);
	});
};

var addClassHelp = function(name, semester, fullName, student) {
	var course = new Class({
		name: name,
		semester: semester,
		fullName: fullName,
		students: [],
		events: [],
		subgroups: []
	});
	course.students.push(student);
	course.save(function(err){
		if(err) throw err;
		console.log('Student saved');
	});
	student.courses.push(course);
	student.save(function(err){
		if(err) throw err;
	});
};

//Usage: classAddStudent("course name", "student email")
//Add a new student to a class
var classAddStudent = function (courseName, email) {
	getClass(courseName,function(course) {
	getStudent(email,function(student){
		classAddStudentHelp(course,student);
	});
	});
};

var classAddStudentHelp = function(course, student) {
	course.students.push(student);
	course.save(function(err){
		if(err) throw err;
	});
	student.courses.push(course);
	student.save(function(err) {
		if(err) throw err;
	});
}

//Usage: classAddEvent("event name", "event description", "event type", "course name", start time in javascript Date format)
//Add a new event to a class
var classAddEvent = function(name, description, type, courseName, startTime){
	getClass(courseName, function(course){
		classAddEventHelp(name,description,type,course,startTime);
	});
};

var classAddEventHelp = function(name, description, type, course, startTime) {
	var event = new Event({
		name: name,
		description: description,
		type: type,
		className: course,
		startTime: startTime,
		students: []
	});
	event.save(function(err) {
		if(err) throw err;
	});
	course.events.push(event);
	course.save(function(err) {
		if(err) throw err;
	});
};

//Usage: classAddGroup("group name", "course name", "student email")
//Add a new subgroup to a class
var classAddGroup = function(name, courseName, email) {
	getClass(courseName,function(course) {
	getStudent(email,function(student){
		classAddGroupHelp(name,course,student);
	});
	});
};
var classAddGroupHelp = function(name, course, student) {
	var group = new Group({
		name: name,
		className: course,
		students: []
	});
	group.students.push(student);
	group.save(function(err) {
		if(err) throw err;
	});
	course.subgroups.push(group);
	course.save(function(err) {
		if(err) throw err;
	});
	student.subgroups.push(group);
	student.save(function(err) {
		if(err) throw err;
	});
};

//Usage: getClass("class name", function(course){*whatever you want to do with the course document*})
//Find a class by name; Returns class document
var getClass = function(className, callback) {
	Class.findOne({name: className}, function(err, course) {
		if(err) throw err;
		callback(course);
	});
};

//Usage: getStudent("class name", function(student){*whatever you want to do with the student document*})
//Find a Student by email; Returns student document
var getStudent = function(email,callback) {
	Student.findOne({email: email}, function(err, student){
		if(err) throw err;
		callback(student);
	});
};

var getEvent = function(name, callback) {
	Event.findOne({name:name}, function(err, event){
		if(err) throw err;
		callback(event);
	});
}

var getGroup = function(name, callback) {
	Group.findOne({name:name}, function(err, group){
		if(err) throw err;
		callback(group);
	});
}

//Usage: getEvent("class name", function(event){*whatever you want to do with the event document*})
//Get all events for a class; Returns an array of Event documents
var getEvents = function(className, callback) {
	Class.find({name: className}, function(err, course) {
		if(err) throw err;
		callback(course);
	});
};

//Usage: getGroup("class name", function(group){*whatever you want to do with the group document*})
//Get all groups for a class; Returns an array of Group documents
var getGroups = function(className, callback) {
	Class.find({name: className}, function(err, course) {
		if(err) throw err;
		callback(course.subgroups);
	});
};


//Usage: groupAddStudent("student email", Group document)
//Add a new student to a group
var groupAddStudent = function(email, group) {
	getStudent(email,function(student){
		groupAddStudentHelp(student,group);
	});
};

var groupAddStudentHelp = function(student, group) {
	group.students.push(student);
	group.save(function(err){
		if(err) throw err;
	});
	student.subgroups.push(group);
	student.save(function(err){
		if(err) throw err;
	});
};

//Usage: eventAddStudent("student email", Event document)
//Add a new student to an Event
var eventAddStudent = function(email, event1) {
	getStudent(email,function(student){
		eventAddStudentHelp(event1,student);
	});
};

var eventAddStudentHelp = function(event1, student) {
	event1.students.push(student);
	event1.save(function(err) {
		if(err) throw err;
	});
	student.events.push(event1);
	student.save(function(err) {
		if(err) throw err;
	});
};

//Usage: groupRemoveStudent(Group document, "student email")
//Remove a student from a group
var groupRemoveStudent = function(group, email) {
	getStudent(email,function(student){
		groupRemoveStudentHelp(group,student);
	});
};

var groupRemoveStudentHelp = function(group, student) {
	group.students.splice(group.students.indexOf(student._id), 1);
	group.save(function(err){
		if(err) throw err;
	});
	student.subgroups.splice(student.subgroups.indexOf(group._id), 1);
	student.save(function(err) {
		if(err) throw err;
	});
};

//Usage: eventRemoveStudent(Event document, "student email")
//Remove a student from an event
var eventRemoveStudent = function(event1, email) {
	getStudent(email,function(student){
		eventRemoveStudentHelp(event1,student);
	});
};

var eventRemoveStudentHelp = function(event1, student) {
	event1.students.splice(event1.students.indexOf(student._id), 1);
	event1.save(function(err) {
		if(err) throw err;
	});
	student.events.splice(student.events.indexOf(event1._id), 1);
	student.save(function(err){
		if(err) throw err;
	});
};

//Usage: getUserEvents("student email", function(events){*whatever you want to do with the events*}) ***note that the item returned by this function is an array of event documents
//Get array of events for a particular user. Returns array of Event documents
var getUserEvents = function(email, callback) {
	getStudent(email,function(student){
		parseEvents(student.events, [], callback);
	});
};

var parseEvents = function(events, ret, callback) {
	var i = ret.length;
	var ret1 = ret;
	if(i == events.length) {
		callback(ret);
	} else {
		Event.findById(events[i], function(err, event) {
			if (event) {
				ret1.push(event.name);
			}
			parseEvents(events, ret1, callback);
		});
	}
};

//Usage: getUserCourses("student email", function(courses){*whatever you want to do with the courses*}) ***note that the item return by this function is an array of course documents
//Get array of courses for a particular user. Returns array of Course documents
var getUserCourses = function(email, callback) {
	getStudent(email,function(student){
		parseCourses(student.courses, [], callback);
	});
};

var parseCourses = function(courses, ret, callback) {
	var i = ret.length;
	var ret1 = ret;
	if(i == courses.length) {
		callback(ret);
	} else {
		Class.findById(courses[i], function(err, course){
			if(course) {
			ret1.push(course.name);
			}
			parseCourses(courses, ret1, callback);
		});
	}
}

//Usage: getUserInvites("student email", function(invites){*whatever you want to do with the invites*}) ***note that the item return by this function is an array of group names for the invites
//Get array of invite for a particular user. Returns array of group names
var getUserInvites = function(email, callback) {
	getStudent(email,function(student){
		parseInvites(student.invites, [], callback);
	});
};

var parseInvites = function(invites, ret, callback) {
	var i = ret.length;
	var ret1 = ret;
	if(i == invites.length) {
		callabck(ret);
	} else {
		Invite.findById(invites[i], function(err,invite){
			if(invite) {
				Group.findById(invite.group, function(err, group) {
					if (group) {
						ret1.push(group.name);
					}
					parseInvites(invites, ret1, callback);
				});
			}
		});
	}
};

//Usage: createInvite("student you want to invite's email", Group document, Student who sent the invite Document)
//create an invitation for a group; includes group the invite is for, the student who the invite was from, student who the invite was too
var createInvite = function(targetEmail, group, student){
	getStudent(targetEmail, function(toStudent){
		var invite = new Invite({
			group: group,
			studentTo: toStudent,
			studentFrom: student
		});
		invite.save(function(err){
			if(err) throw err;
		});
		toStudent.invites.push(invite);
		toStudent.save(function(err){
			if(err) throw err;
		});
	});
};

//Usage: acceptInvite(Invite document)
//accept invitation and add the student to the group
var acceptInvite = function(invite) {
	groupAddStudent(invite.toStudent.email, invite.group);
	invite.toStudent.invites.id(invite._id).remove();
	invite.remove();

};

//Usage: declineInvite(Invite document)
//decline invitation
var declineInvite = function(invite) {
	invite.toStudent.invites.id(invite._id).remove();
	invite.remove();
};

//Usage: getUserInvites("student email", function(invites){*whatever you want to do with the invites*}) ***note that the item returned by this function is an array of invite documents
//get Array of invites for a particular user. Returns array of Invite documents
var getUserInvites = function(email, callback) {
	getStudent(email, function(student){
		callback(student.invites);
	});
};

var getUserGroups = function(email, callback) {
	getStudent(email, function(student){
		callback(student.subgroups);
	});
};

var deleteCourse = function(name) {
	Course.findOneAndRemove({name:name}, function(err){
		if(err) throw err;
	});
};

module.exports = {
createUser,
enrollUser,
addClass,
getEvent,
getGroup,
classAddStudent,
classAddEvent,
classAddGroup,
getClass,
getStudent,
getEvents,
getGroups,
groupAddStudent,
eventAddStudent,
groupRemoveStudent,
eventRemoveStudent,
getUserEvents,
getUserCourses,
getUserInvites,
getUserGroups,
createInvite,
acceptInvite,
declineInvite,
deleteCourse
}; 
