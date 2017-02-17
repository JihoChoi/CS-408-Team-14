var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require(./schema);
var User = mongoose.model("User");
var Class = mongoose.model("Class");

var EventSchema = new Schema({
	name: String,
	description: String,
	type: String,
	className: Class,
	startTime: Date,
	students: [type: User],
});

var Event = mongoose.model('Event', EventSchema);
module.exports = Event;
