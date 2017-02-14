var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Class = mongoose.model("Class");
var User = mongoose.model("User");

var GroupSchema = new Schema({
	name: String,
	class: Class,
	students: [type: User],

});


var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;