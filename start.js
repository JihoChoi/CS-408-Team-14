var http = require('http');
var fs = require('fs');
var url = require('url');
var colors = require('colors');
var port = 8080;
var notfound = fs.readFileSync("./public/html/pages/notfound.html");

// Create a server
http.createServer( function (request, response) {  
   // Parse the request containing file name
   var pathname = url.parse(request.url).pathname;
   
   // Configuration for server navigation
   var prepath = "./public";

   // Print the name of the file for which request is made.
   console.log("Request for " + pathname + " received.");
   
   // Check if file format specified
   if (!pathname.includes(".")) {
      if (pathname.endsWith("/"))
         pathname += "index.html";
      else
         pathname += "/index.html";
   }

   // Pre-path
   if (pathname.endsWith(".ico"))
      prepath += "/icons";
   else
      prepath += "/html";

   // Read the requested file content from file system
   fs.readFile(prepath + pathname, function (err, data) {
      if (err) {
         console.error("[" + "404".red + "] " + pathname + " not found");
         // HTTP Status: 404 [NOT FOUND]
         // Content Type: text/plain
         response.writeHead(404, {'Content-Type': 'text/html'});

         // Write the 404 template
         response.write(notfound.toString());
      } else {
         console.log("[" + "200".green + "]" + " Access to " + pathname + " granted.");
         // HTTP Status: 200 [OK]
         // Content Type: text/plain
         response.writeHead(200, {'Content-Type': 'text/html'});	
         
         // Write the content of the file to response body
         response.write(data.toString());		
      }
      // Send the response body 
      response.end();
   });   
}).listen(port);

// Console will print the message
console.log('Server running at localhost:' + port);


