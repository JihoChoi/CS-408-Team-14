var mongoose = require('mongoose');
var Student = require("./schema/student.js");
var Event = require("./schema/event.js");
var Group = require("./schema/group.js");
var Class = require("./schema/class.js");
var Invite = require("./schema/invite.js");
var ObjectId = require('mongoose').Types.ObjectId; 

//DocumentArrays have a special id method for looking up a document by its _id
//link here: http://mongoosejs.com/docs/subdocs.html
/*
function liveTime() {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	if (month < 5) {
		month = 4;
	} else if (month < 8) {
		month = 7;
	} else {
		month = 11;
	}
	var semEnd = new Date(year, month, 28, 0,0,0,0);
	return parseInt((semEnd-now)/1000/60/60/24) + "d";
}
*/

//Usage: createUser("student email", callback function);
//Cretes a user and adds it to the database. Mostly a helper function. Use at your own discretion
var createUser = function(email, callback) {
	var student = new Student({
		email: email,
		courses: [],
		events: [],
		subgroups: [],
		invites: []
	});
	student.save(function(err){
		if(err) throw err;
		callback();
	});
};

//Usage: enrollUser("student email", callback function); **the callback function is only here so that the code doesn't continue before the user can be created, which would casue a crash
//Checks if a user exists, if it does do nothing, if it doesn't, creates it
var enrollUser = function(email,callback) {
	getStudent(email, function(student){
		if(student) {
		callback();
		} else {
		createUser(email, callback);
		}
	});
	
};

//Usage: addClass("class name", "semester", "full class name", "student email")
//Create a new class
var addClass = function(name, semester, fullName, description, email, callback){
	getStudent(email,function(student){
		if(student) {
			addClassHelp(name,semester,fullName, description,student,callback);
		}
	});
};

var addClassHelp = function(name, semester, fullName, description, student,callback) {
	var course = new Class({
		name: name,
		semester: semester,
		fullName: fullName,
		description: description,
		posts: [],
		emails:[],
		students: [],
		events: [],
		subgroups: []
	});
//	course.ttl=liveTime();
	course.emails.push(student.email);
	course.students.push(student);
	course.save(function(err){
		if(err) throw err;
		console.log('Student saved');
	});
	student.courses.push(course);
	student.save(function(err){
		if(err) throw err;
		callback();
	});
};

//Usage: classAddStudent("course name", "student email")
//Add a new student to a class
var classAddStudent = function (courseName, email,callback) {
	getClass(courseName,function(course) {
	getStudent(email,function(student){
		if(course && student) {
		classAddStudentHelp(course,student,callback);
		}
	});
	});
};

var classAddStudentHelp = function(course, student,callback) {
	course.emails.push(student.email);
	course.students.push(student);
	course.save(function(err){
		if(err) throw err;
	});
	student.courses.push(course);
	student.save(function(err) {
		if(err) throw err;
		callback();
	});
};

var classAddPost = function(className, post,callback) {
	getClass(className, function(course){
		course.posts.push(post);
		course.save(function(err){
			if(err) throw err;
			callback();
		});
	});
};
//Remove a studnet from a class
var classRemoveStudent = function(courseName, email, callback) {
	getClass(courseName, function(course) {
		getStudent(email, function(student) {
			if(course && student) {
			classRemoveStudentHelp(course, student,callback);
			}
		});
	});
};

var classRemoveStudentHelp = function(course, student,callback) {
	course.emails.splice(course.emails.indexOf(student.email),1);
	course.students.splice(course.students.indexOf(student._id), 1);
	course.save(function(err) {
		if(err) throw err;
	});
	student.courses.splice(student.courses.indexOf(course._id), 1);
	student.save(function(err) {
		if(err) throw err;
		callback();
	});
};

//Usage: classAddEvent("event name", "event description", "event type", "course name", start time in javascript Date format)
//Add a new event to a class
var classAddEvent = function(name, description, type, courseName, startTime,email,callback){
	getClass(courseName, function(course){
	getStudent(email, function(student) {
		if(course && student) {
		classAddEventHelp(name,description,type,course,startTime, student,callback);
		}
		});
	});
};

var classAddEventHelp = function(name, description, type, course, startTime, student,callback) {
	var event1 = new Event({
		name: name,
		description: description,
		type: type,
		className: course.name,
		startTime: startTime,
		students: []
	});
	//event.ttl=liveTime();
	event1.students.push(student);
	event1.save(function(err) {
		if(err) throw err;
	});
	course.events.push(event1);
	course.save(function(err) {
		if(err) throw err;
		callback();
	});
	student.events.push(event1);
	student.save(function(err) {
		if(err) throw err;
	});
};

//Usage: classAddGroup("group name", "course name", "student email")
//Add a new subgroup to a class
var classAddGroup = function(name, courseName, email,callback) {
	getClass(courseName,function(course) {
	getStudent(email,function(student){
		if(course && student) {
		classAddGroupHelp(name,course,student,callback);
		}
	});
	});
};
var classAddGroupHelp = function(name, course, student,callback) {
	var group = new Group({
		name: name,
		className: course.name,
		students: []
	});
	//group.ttl=liveTime();
	group.students.push(student);
	group.save(function(err) {
		if(err) throw err;
	});
	course.subgroups.push(group);
	course.save(function(err) {
		if(err) throw err;
	});
	student.subgroups.push(group);
	student.save(function(err) {
		if(err) throw err;
		callback();
	});
};

var classGetPosts = function(courseName, callback) {
	getClass(courseName, function(course) {
		callback(course.posts);
	});
};

//Usage: getClass("class name", function(course){*whatever you want to do with the course document*})
//Find a class by name; Returns class document
var getClass = function(className, callback) {
	Class.findOne({name: className}, function(err, course) {
		if(err) throw err;
		callback(course);
	});
};

//Usage: getStudent("class name", function(student){*whatever you want to do with the student document*})
//Find a Student by email; Returns student document
var getStudent = function(email,callback) {
	Student.findOne({email: email}, function(err, student){
		if(err) throw err;
		callback(student);
	});
};

var getEvent = function(name, callback) {
	Event.findById(name, function(err, event1){
		if(err) throw err;
		callback(event1);
	});
}

var getGroup = function(name, callback) {
	console.log(name);
	Group.findOne({name:name}, function(err, group){
		if(err) throw err;
		callback(group);
	});
}

//Usage: getEvent("class name", function(event){*whatever you want to do with the event document*})
//Get all events for a class; Returns an array of Event documents
var getEvents = function(className, callback) {
	Class.find({name: className}, function(err, course) {
		if(err) throw err;
		callback(course);
	});
};

//Usage: getGroup("class name", function(group){*whatever you want to do with the group document*})
//Get all groups for a class; Returns an array of Group documents
var getGroups = function(className, callback) {
	Class.find({name: className}, function(err, course) {
		if(err) throw err;
		callback(course.subgroups);
	});
};


//Usage: groupAddStudent("student email", Group document)
//Add a new student to a group
var groupAddStudent = function(email, group) {
	getStudent(email,function(student){
		Group.findById(group, function(err,group1) {
			if(student && group1) {
				groupAddStudentHelp(student,group1);
			}
		}
	});
};

var groupAddStudentHelp = function(student, group) {
	group.students.push(student);
	group.save(function(err){
		if(err) throw err;
	});
	student.subgroups.push(group);
	student.save(function(err){
		if(err) throw err;
	});
};

//Usage: eventAddStudent("student email", Event document)
//Add a new student to an Event
var eventAddStudent = function(email, event1, callback) {
	getStudent(email,function(student){
		Event.findById(event1, function(err, event2) {
			if(student && event2) {
			eventAddStudentHelp(event1,student,callback);
			}
		});
	});
};

var eventAddStudentHelp = function(event1, student,callback) {
	event1.students.push(student);
	event1.save(function(err) {
		if(err) throw err;
	});
	student.events.push(event1);
	student.save(function(err) {
		if(err) throw err;
		callback();
	});
};

//Usage: groupRemoveStudent(Group document, "student email")
//Remove a student from a group
var groupRemoveStudent = function(group, email,callback) {
	getStudent(email,function(student){
		groupRemoveStudentHelp(group,student,callback);
	});
};

var groupRemoveStudentHelp = function(group, student,callback) {
	group.students.splice(group.students.indexOf(student._id), 1);
	group.save(function(err){
		if(err) throw err;
	});
	student.subgroups.splice(student.subgroups.indexOf(group._id), 1);
	student.save(function(err) {
		if(err) throw err;
		callback();
	});
};

//Usage: eventRemoveStudent(Event document, "student email")
//Remove a student from an event
var eventRemoveStudent = function(event1, email,callback) {
	getStudent(email,function(student){
		eventRemoveStudentHelp(event1,student,callback);
	});
};

var eventRemoveStudentHelp = function(event1, student) {
	event1.students.splice(event1.students.indexOf(student._id), 1);
	event1.save(function(err) {
		if(err) throw err;
	});
	student.events.splice(student.events.indexOf(event1._id), 1);
	student.save(function(err){
		if(err) throw err;
		callback();
	});
};

//Usage: getUserEvents("student email", function(events){*whatever you want to do with the events*}) ***note that the item returned by this function is an array of event documents
//Get array of events for a particular user. Returns array of Event documents
var getUserEvents = function(email, callback) {
	getStudent(email,function(student){
		parseEvents(student.events, [], callback);
	});
};

var parseEvents = function(events, ret, callback) {
	var i = ret.length;
	var ret1 = ret;
	if(i == events.length) {
		callback(ret);
	} else {
		Event.findById(events[i], function(err, event1) {
			if (event1) {
				ret1.push(event1);
			} else {
				ret1.push("");
			}
			parseEvents(events, ret1, callback);
		});
	}
};

//Usage: getUserCourses("student email", function(courses){*whatever you want to do with the courses*}) ***note that the item return by this function is an array of course documents
//Get array of courses for a particular user. Returns array of Course documents
var getUserCourses = function(email, callback) {
	getStudent(email,function(student){
		parseCourses(student.courses, [], callback);
	});
};

var parseCourses = function(courses, ret, callback) {
	var i = ret.length;
	var ret1 = ret;
	if(i == courses.length) {
		callback(ret);
	} else {
		Class.findById(courses[i], function(err, course){
			if(course) {
				ret1.push(course.name);
			} else {
				ret1.push("");
			}
			parseCourses(courses, ret1, callback);
		});
	}
}


//Returns an array of course DOCUMENTS for a particular student
var getUserCoursesFull = function(email, callback) {
	getStudent(email, function(student) {
		callback(student.courses);
	});
};

//Usage: getUserInvites("student email", function(invites){*whatever you want to do with the invites*}) ***note that the item return by this function is an array of group names for the invites
//Get array of invite for a particular user. Returns array of group names
var getUserInvites = function(email, callback) {
	getStudent(email,function(student){
		parseInvites(student.invites, [], callback);
	});
};

var parseInvites = function(invites, ret, callback) {
	var i = ret.length;
	var ret1 = ret;
	if(i == invites.length) {
		callabck(ret);
	} else {
		Invite.findById(invites[i], function(err,invite){
			if(invite) {
				Group.findById(invite.group, function(err, group) {
					if (group) {
						ret1.push(group.name);
					} else {
						ret1.push("");
					}
					parseInvites(invites, ret1, callback);
				});
			}
		});
	}
};

//Usage: createInvite("student you want to invite's email", Group document, Student who sent the invite Document)
//create an invitation for a group; includes group the invite is for, the student who the invite was from, student who the invite was too
var createInvite = function(targetEmail, group, student){
	getStudent(targetEmail, function(toStudent){
		var invite = new Invite({
			group: group,
			studentTo: toStudent,
			studentFrom: student
		});
	//	invite.ttl=liveTime();
		invite.save(function(err){
			if(err) throw err;
		});
		toStudent.invites.push(invite);
		toStudent.save(function(err){
			if(err) throw err;
		});
	});
};

//Usage: acceptInvite(Invite document)
//accept invitation and add the student to the group
var acceptInvite = function(invite) {
	groupAddStudent(invite.toStudent.email, invite.group);
	invite.toStudent.invites.id(invite._id).remove();
	invite.remove();

};

//Usage: declineInvite(Invite document)
//decline invitation
var declineInvite = function(invite) {
	invite.toStudent.invites.id(invite._id).remove();
	invite.remove();
};

//Usage: getUserInvites("student email", function(invites){*whatever you want to do with the invites*}) ***note that the item returned by this function is an array of invite documents
//get Array of invites for a particular user. Returns array of Invite documents
var getUserInvites = function(email, callback) {
	getStudent(email, function(student){
		callback(student.invites);
	});
};

var getUserGroups = function(email, callback) {
	getStudent(email, function(student){
		parseGroupFull(student.groups, [], callback);
	});
};

var deleteCourse = function(name) {
	Class.findOne({name: name}, function(err, course) {
		if(course) {
		for (var i = 0; i < course.students.length; i++) {
			Student.findById(course.students[i], function(err, student){
				if (student) {
					classRemoveStudent(course.name, student.email);
				}
				if(i == course.students.length-1) {
					Class.findOneAndRemove({name:name}, function(err){
						if(err) throw err;
					});
				}
			});
		}
		}
	});
};

var purgeCourse = function(email) {
	getStudent(email, function(student){
		for (var i = 0; i < student.courses.length; i++) {
			Class.findById(student.courses[i], function(err, course){
				if(!course){
					student.courses.splice(i,1);
				}
				if(i == student.courses-1){
					student.save(function(err){
						if(err)throw err;
					});
				}
			});
		}
	});
}
//************DOESNT WORK *****************
var courseExists = function(className) {
	getClass(className, function(course) {
		return(Boolean(course));
	});
}

var getAllCourses = function(callback) {
	Class.find({},function(err, courses){
		var arr = courses;
		var ret = [];
		for (var i = 0; i < arr.length; i++) {
			ret.push(arr[i].name);
			if(i == arr.length-1) {
			callback(ret);
			}
		}
	});
}

var classGetStudents = function(className, callback) {
	Class.findOne({name:className}, function(err, course) {
		parseStudents(course.students,[],callback);
	});
}

var parseStudents = function(students,ret, callback) {
	var i = ret.length;
	var ret1 = ret;
	if(i==students.length) {
		callback(ret);
	} else {
		Student.findById(students[i], function(err, student){
			if(student) {
				ret1.push(student.email);
			} else {
				ret1.push("");
			}
			parseStudents(students, ret1, callback);
		});
	}
}

var parseGroupFull = function(groups, ret, callback) {
	var i = ret.length;
	var ret1 = ret;
	if(groups==null) {
		callback(null);
	}else if( i==groups.length) {
		callback(ret);
	} else {
	Group.findById(groups[i], function(err,group) {
		if(group) {
			ret1.push(group);
		} else { 
			ret1.push("");
		}
		parseGroupFull(groups, ret1, callback);
	});
	}
}
var parseEventFull = function(events, ret, callback) {
	var i = ret.length;
	var ret1 = ret;
	if(events == null) {
		callback(null);
	} else if( i==events.length) {
		callback(ret);
	} else {
	Event.findById(events[i], function(err,event1) {
		if(event1) {
			ret1.push(event1);
		} else { 
			ret1.push("");
		}
		parseEventFull(events, ret1, callback);
	});
	}
}
var parseStudentFull = function(students, ret, callback) {
	var i = ret.length;
	var ret1 = ret;
	if(students == null) {
		callback(null);
	} else 	if( i==students.length) {
		callback(ret);
	} else {
	Student.findById(students[i], function(err,student) {
		if(student) {
			ret1.push(student);
		} else { 
			ret1.push("");
		}
		parseStudentFull(students, ret1, callback);
	});
	}
}

var getClassEvents = function(courseName, callback) {
	getClass(courseName, function(course) {
		if(course) {
		parseEventFull(course.events, [], callback);
		}
	});
}

var getClassGroups = function(courseName, callback) {
	getClass(courseName, function(course) {
		if(course) {
		parseGroupFull(course.subgroups, [], callback);
		}
	});
}

var getClassStudents = function(courseName, callback) {
	getClass(courseName, function(course) {
		if(course) {
		parseStudentFull(course.students, [], callback);
		}
	});
}

var getEventName = function(eventName, callback) {
	Event.findOne({name: eventName}, function(err, event1) {
		if(err) throw err;
		callback(event1);
	});
}

var getSummary = function(email, callback) {
	getStudent(email, function(student) {
		getSummaryHelp(student.courses, [], callback, 0);
	});
};

var getSummaryHelp = function(courses, ret, callback, i) {
	var ret1 = ret;
	if(courses == null) {
		ret.push("No posts yet!");
	} else  if(i == courses.length){
		callback(ret);
	} else {
	Class.findById(courses[i], function(err, course) {
		if(course && course.posts.length > 0) {
			ret.push(course.name + ": " + course.posts[course.posts.length-1]);
		}
		getSummaryHelp(courses, ret1, callback, i+1);
	});
	}
};


module.exports = {
createUser,
enrollUser,
addClass,
getEvent,
getGroup,
classAddStudent,
classAddPost,
classAddEvent,
classAddGroup,
classGetPosts,
getClass,
getStudent,
getEvents,
getGroups,
groupAddStudent,
eventAddStudent,
groupRemoveStudent,
eventRemoveStudent,
getUserEvents,
getUserCourses,
getUserInvites,
getUserGroups,
createInvite,
acceptInvite,
declineInvite,
deleteCourse,
getUserCoursesFull,
classRemoveStudent,
//liveTime,
purgeCourse,
//courseExists,
getAllCourses,
//classGetStudents,
getClassEvents,
getClassGroups,
getClassStudents,
getEventName,
getSummary
}; 
