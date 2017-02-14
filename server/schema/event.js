var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model("User");
var Class = mongoose.model("Class");

var EventSchema = new Schema({
	name: String,
	class: Class,
	startTime: Date,
	endTime: Date,
	students: [type: User],
});

var Event = mongoose.model('Event', EventSchema);
module.exports = Event;