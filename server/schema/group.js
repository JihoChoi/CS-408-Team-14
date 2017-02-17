var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Class = require("./class.js");
var Student = require("./student.js");

var GroupSchema = new Schema({
	name: String,
	className: {type: mongoose.Schema.Types.ObjectId, ref:'Class'},
	students: [{type:mongoose.Schema.Types.ObjectId, ref: 'Student'}]

});


var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
