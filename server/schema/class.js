var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Student = require("./student.js");
var Event = require("./event.js");
var Group = require("./group.js");

var Class1 = new Schema({
	name: String,
	semester: String,
	fullName: String,
	students: [{type:mongoose.Schema.Types.ObjectId, ref: 'Student'}],
	events: [{type:mongoose.Schema.Types.ObjectId, ref: 'Event'}],
	subgroups: [{type:mongoose.Schema.Types.ObjectId, ref: 'Group'}]
});


var Class = mongoose.model('Class', Class1);
module.exports = Class;
