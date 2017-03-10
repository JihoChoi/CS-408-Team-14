var mongoose = require('mongoose');
mongoose.connect('mongodb://application:coconutWatr@ds153179.mlab.com:53179/coconutwatr');
var Student = require("./schema/student.js");
var Event = require("./schema/event.js");
var Group = require("./schema/group.js");
var Class = require("./schema/class.js");
var Invite = require("./schema/invite.js");
var db = require("./db.js");
