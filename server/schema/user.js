var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username : String,
	email: String,
	courses: [{type: mongoose.Schema.Types.ObjectId, ref:'Class'}],
	events: [{type:mongoose.Schema.Types.ObjectId, ref: 'Event'}],
	subgroups: [{type:mongoose.Schema.Types.ObjectId, ref: 'Group'}]
});


var User = mongoose.model('User', UserSchema);
module.exports = User;


