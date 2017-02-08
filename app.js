var express = require('express');
var app = express();
var colors = require('colors');
var prepath = "/public";
var port = 8080;

app.get('/', function(request, response) {
	response.send(prepath + "/html/index.html");
})

var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.port().port;
	console.log("LISTEN".green + " https://%s:%s", host, port);
})