var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//require multipart package
var mime = require('mime');
//require vcap services to perform authentication
var vcapServices = require('vcap_services');
//require and use bluemix cloud foundry env
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('appName', 'z2c-simplified-s2t');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require("./controller/restapi/router"));
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.createServer(app).listen(app.get('port'),
    function(req, res) {
        console.log(app.get('appName')+' is listening on port: ' + app.get('port'));
    });

function loadSelectedFile(req, res) {
    var uri = req.originalUrl;
    var filename = __dirname + "/HTML" + uri;
    fs.readFile(filename,
        function(err, data) {
            if (err) {
                res.writeHead(500);
                console.log('Error loading ' + filename + ' error: ' + err);
                return res.end('Error loading ' + filename);
            }
            res.setHeader('content-type', mime.lookup(filename));
            res.writeHead(200);
            res.end(data);
        });
}


module.exports = app;
