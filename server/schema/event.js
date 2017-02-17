var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Student = require("./student.js");
var Class = require("./class.js");

var EventSchema = new Schema({
	name: String,
	description: String,
	type: String,
	className: {type:mongoose.Schema.Types.ObjectId, ref: 'Class'},
	startTime: Date,
	students: [{type:mongoose.Schema.Types.ObjectId, ref: 'Student'}]
});

var Event = mongoose.model('Event', EventSchema);
module.exports = Event;
