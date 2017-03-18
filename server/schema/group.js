var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Class = require("./class.js");
var Student = require("./student.js");
var ttl = require("mongoose-ttl");

var GroupSchema = new Schema({
	name: String,
	className: {type: mongoose.Schema.Types.ObjectId, ref:'Class'},
	students: [{type:mongoose.Schema.Types.ObjectId, ref: 'Student'}]

});

GroupSchema.plugin(ttl, {ttl: 60000});

var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
