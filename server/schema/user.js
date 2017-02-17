var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require('./schema');

var UserSchema = new Schema({

});


var User = mongoose.model('Uesr', UserSchema);
module.exports = User;


