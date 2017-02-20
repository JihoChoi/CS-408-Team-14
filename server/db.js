var mongoose = require('mongoose');
var Student = require("./schema/student.js");
var Event = require("./schema/event.js");
var Group = require("./schema/group.js");
var Class = require("./schema/class.js");

//DocumentArrays have a special id method for looking up a document by its _id
//link here: http://mongoosejs.com/docs/subdocs.html

//Create a new class
var addClass = function(name, semester, fullName, student) {
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

//Add a new student to a class
var classAddStudent = function (course, student) {
	course.students.push(student);
	course.save(function(err){
		if(err) throw err;
		console.log('Student added to class');
	});
	student.courses.push(course);
	student.save(function(err) {
		if(err) throw err;
	});
};

//Add a new event to a class
var classAddEvent = function(name, description, type, course, startTime) {
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
		console.log('Event added');
	});
	course.events.push(event);
	course.save(function(err) {
		if(err) throw err;
	});
};

//Add a new subgroup to a class
var classAddGroup = function(name, course, student) {
	var group = new Group({
		name: name,
		className: course,
		students: []
	});
	group.students.push(student);
	group.save(function(err) {
		if(err) throw err;
		console.log('Group added');
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

//Find a class by name; Returns class document
var getClass = function(className) {
	Class.find({name: className}, function(err, course) {
		if(err) throw err;
		return course;
	});
};

//Find a Student by email; Returns student document
var getStudent = function(email) {
	Student.findOne({email: email}, function(err, student){
		return student;
	});
};

//Get all events for a class; Returns an array of Event documents
var getEvents = function(className) {
	Class.find({name: className}, function(err, course) {
		return course.events;
	});
};

//Get all groups for a class; Returns an array of Group documents
var getGroups = function(className) {
	Class.find({name: className}, function(err, course) {
		return course.subgroups;
	});
};

//Add a new student to a group
var groupAddStudent = function(student, group) {
	group.students.push(student);
	group.save(function(err){
		if(err) throw err;
		console.log("Student added to group");
	});
	student.subgroups.push(group);
	student.save(function(err){
		if(err) throw err;
	});
};

//Add a new student to an Event
var eventAddStudent = function(event, student) {
	event.students.push(student);
	event.save(function(err) {
		if(err) throw err;
	});
	student.events.push(event);
	student.save(function(err) {
		if(err) throw err;
	});
};

//Remove a student from a group
var groupRemoveStudent = function(group, student) {
	group.students.id(student._id).remove();
	group.save(function(err){
		if(err) throw err;
	});
	student.subgroups.id(group._id).remove();
	student.save(function(err) {
		if(err) throw err;
	});
};

//Remove a student from an event
var eventRemoveStudent = function(event, student) {
	event.students.id(student._id).remove();
	event.save(function(err) {
		if(err) throw err;
	});
	student.events.id(event._id).remove();
	student.save(function(err){
		if(err) throw err;
	});
};

//Get array of events for a particular user. Returns array of Event documents
var getUserEvents = function(student) {
	return student.events;
};

module.exports = {
addClass,
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
eventRemoveStudent
}; 