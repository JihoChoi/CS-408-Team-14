var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = import(user.js);
var User = mongoose.model("User");

var Class1 = new Schema({
	name: String,
	subject: String,
	courseNumber: Number,
	students: [type: User],
	numberOfStudents: Number

});


var Class = mongoose.model('Class', Class1);
module.exports = Class;