var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inviteSchema = new Schema({
	group: {type: mongoose.Schema.Types.ObjectId, ref:'Group'},
	studentFrom: {type: mongoose.Schema.Types.ObjectId, ref:'Student'},
	studentTo: {type: mongoose.Schema.Types.ObjectId, ref:'Student'}
});

var Invite = mongoose.model('Invite', inviteSchema);
module.exports = Invite;