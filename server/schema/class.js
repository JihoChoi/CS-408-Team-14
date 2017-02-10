var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user = import(user.js);

var class = new Schema({
	name: String,
	subject: String,
	courseNumber: Number,
	students: [type: user],
	numberOfStudents: Number

});
