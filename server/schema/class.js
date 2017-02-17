var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require("./user.js");
var Event = require("./event.js");
var Group = require("./group.js");

var Class1 = new Schema({
	name: String,
	semester: String,
	fullName: String,
	students: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
	events: [{type:mongoose.Schema.Types.ObjectId, ref: 'Event'}],
	subgroups: [{type:mongoose.Schema.Types.ObjectId, ref: 'Group'}]

});


var Class = mongoose.model('Class', Class1);
module.exports = Class;
