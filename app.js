var express = require('express');
var app = express();
var colors = require('colors');
var prepath = __dirname + "/public";
var port = 8080;

app.get('/', function(request, response) {
	console.log("200".green + " requested page (/) granted.");
	response.sendFile(prepath + "/html/index.html");
})

var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("LISTENING".green + " https://%s:%s", host, port);
})