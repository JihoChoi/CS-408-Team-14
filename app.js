var express = require('express');
var app = express();
var hand = require('express-handlebars');
var colors = require('colors');
var prepath = __dirname + "/public";
var host = "127.0.0.1";
var port = 5000;

app.set('port', (process.env.PORT || port));
app.use(express.static(prepath));

app.set('views', prepath + "/html/pages");
app.engine('handlebars', hand({
    layoutsDir: prepath + "/html/pages/",
    defaultLayout: "dashboard"
}));
app.set('view engine', 'handlebars');
app.use('/vendor', express.static(prepath + "/html/vendor"));

app.get('/', function(request, response) {
	console.log("200".green + " requested page (/) granted.");
	response.status(200);
    response.render('dashboard');
});

// Add new pages here


// If nothing matches, go 404
app.get('*', function(request, response) {
    console.log("404".red + " requested page not found.");
    response.status(404);
    response.sendFile(prepath + "/html/notfound.html");
});

app.listen(app.get('port'), function() {
    console.log("LISTENING".magenta + " on port " + app.get('port'));
});
