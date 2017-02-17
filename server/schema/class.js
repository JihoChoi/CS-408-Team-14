var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('./schema');
var User = mongoose.model("User");
var Event = mongoose.model("Event");
var Post = mongoose.model("Post");
var Group = mongoose.model("Group");

var Class1 = new Schema({
	name: String,
	semester: String,
	fullName: String,
	students: [type: User],
	events: [type: Event],
	posts: [type: Post],
	subgroups: [type Group]

});


var Class = mongoose.model('Class', Class1);
module.exports = Class;
