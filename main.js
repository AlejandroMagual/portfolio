const http = require('http');
const fs = require('fs');
const path = require('path');


http.createServer(function(request, response) {

    // HANDLE REQUEST
    var method = request.method;
    var url = request.url;
    var headers = request.headers;
    request.on('error', function(err) {
        console.error(err);
    });

    // HANDLE RESPONSE
    response.on('error', function(err) {
        console.error(err);
    });
    if (method === 'GET') {
        console.log(method,url,headers);
        /*
        PENDING:   It was not possible to set the 'Content-Type' response headers as
                   listed below. Use of path.extname() throws "TypeError: Cannot read
                   property 'extname' of undefined".
        html:      response.setHeader('Content-Type', 'text/html');
        css:       response.setHeader('Content-Type', 'text/css');
        js:        response.setHeader('Content-Type', 'application/javascript');
        json:      response.setHeader('Content-Type', 'application/json');
        images:    response.setHeader('Content-Type', 'image/jpeg');
        */
        response.statusCode = 200;
        var path = searchFilePath(__dirname + '/projects', url.substring(1));
        var readStream = fs.createReadStream(path);
        readStream.pipe(response);
    }
    else {
        response.statusCode = 405;  // Status "Method not allowed"
        response.end();
    };

    // FILE SEARCH FUNCTION
    function searchFilePath(dir, fileName) {
        // if a file of name "fileName" is found, then this function returns a string with the file's path
        // Example:  var path = searchFilePath(__dirname + '/projects','index.html');
        var arrOfFiles = fs.readdirSync(dir);
        for (var i=0; i<arrOfFiles.length; i++) {
            var stats = fs.statSync(dir + '/' + arrOfFiles[i]);
            if (stats.isDirectory())  {
                return searchFilePath(dir + '/' + arrOfFiles[i], fileName);
            } else {
                if (arrOfFiles[i] === fileName) {
                    return dir + '/' + arrOfFiles[i];
                };
            };
        };
    }

}).listen(8080, function() { console.log("listening on port 8080!"); });
