
const express = require('express')
const app = express()
const port = 3000
const multer = require('multer');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function(request, response){
  response.send('Hello from Express!');
});

app.get('/stronzo', function(req, res){
    res.send('LO STRONZO SEI TU');
});


app.listen(port, function(err) {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log('sto andando sulla porta 3000');
});
var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./images");
     },
     filename: function(req, file, callback) {
         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
     }
 });



var upload = multer({
     storage: Storage
 }).array("imgUploader", 3);


 app.get("/", function(req, res) {
     res.sendFile(__dirname + "/index.html");
 });

 app.post("/uploadImages", function(req, res) {
     upload(req, res, function(err) {
         if (err) {
             return res.end("Something went wrong!");
         }
         return res.end("File uploaded sucessfully!.");

	});
});





/*var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
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

module.exports = app;
*/