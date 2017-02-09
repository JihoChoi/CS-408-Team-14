var express = require('express');
var app = express();
var hand = require('express-handlebars');
var colors = require('colors');
var prepath = __dirname + "/public/html";
var host = "127.0.0.1";
var port = 5000;

app.set('port', (process.env.PORT || port));
app.use(express.static(prepath));

app.set('views', prepath + "/pages");
app.engine('handlebars', hand({
    layoutsDir: prepath + "/pages/",
    defaultLayout: "dashboard"
}));
app.set('view engine', 'handlebars');
app.use('/vendor', express.static(prepath + "/vendor"));

app.get('/', function(req, res) {
	console.log("200".green + " requested page (/) granted.");
	res.status(200);
    res.sendFile(prepath + "/pages/dashboard.html");
});

// Add new pages here

app.get(/^(.+)$/, function(req, res) { 
    console.log("200".green + " static file request : " + req.params);
    res.status(200);
    res.sendFile(prepath + req.params[0]); 
 });

// If nothing matches, go 404
app.get('*', function(req, res) {
    console.log("404".red + " requested page not found.");
    res.status(404);
    res.sendFile(prepath + "/notfound.html");
});

app.listen(app.get('port'), function() {
    console.log("LISTENING".magenta + " on port " + app.get('port'));
});
