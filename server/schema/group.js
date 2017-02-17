var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Class = require("./class.js");
var User = require("./user.js");

var GroupSchema = new Schema({
	name: String,
	className: {type: mongoose.Schema.Types.ObjectId, ref:'Class'},
	students: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}]

});


var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
