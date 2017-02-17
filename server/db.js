var mongoose = require('mongoose');
var User = require("./schema/user.js");
var Event = require("./schema/event.js");
var Group = require("./schema/group.js");
var Class = require("./schema/class.js");

//DocumentArrays have a special id method for looking up a document by its _id
//link here: http://mongoosejs.com/docs/subdocs.html

//Create a new class
var addClass =  function() {
	return
};

//Add a new student to a class
var classAddStudent = function () {
	return;
};

//Add a new event to a class
var classAddEvent = function() {
	return;
};

//Add a new subgroup to a class
var classAddGroup = function() {
	return;
};

//Find a class by name
var getClass = function() {
	return;
};

//Find a user by email
var getUser = function() {
	return;
};

//Get all events for a class
var getEvents = function() {
	return;
};

//Get all groups for a class
var getGroups = function() {
	return;
};

//Create a new event for a class
var addEvent = function() {
	return;
};

//Create a new group for a class
var addGroup = function() {
	return;
};

//Add a new student to a group
var groupAddStudent = function() {
	return;
};

//Add a new student to an Event
var eventAddStudet = function() {
	return;
};

//Remove a student from a group
var groupRemoveStudent = function() {
	return;
};

//Remove a student from an event
var eventRemoveStudent = function() {
	return;
};