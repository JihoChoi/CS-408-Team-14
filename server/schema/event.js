var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Student = require("./student.js");
var Class = require("./class.js");
var ttl = require("mongoose-ttl");

var EventSchema = new Schema({
	name: String,
	description: String,
	type: String,
	className: {type:mongoose.Schema.Types.ObjectId, ref: 'Class'},
	startTime: Date,
	students: [{type:mongoose.Schema.Types.ObjectId, ref: 'Student'}]
});
EventSchema.plugin(ttl, {ttl: 60000});
var Event = mongoose.model('Event', EventSchema);
module.exports = Event;
