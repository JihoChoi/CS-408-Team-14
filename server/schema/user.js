var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	google: {
		id : String,
		token : String,
		email: String,
		student: [{type: mongoose.Schema.Types.ObjectId, ref:'Student'}]
	}
});
module.exports = mongoose.model('User', userSchema);
