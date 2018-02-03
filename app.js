const express = require('express')
const app = express()
const port = 3000
const multer = require('multer');
const bodyParser = require('body-parser');
var sendPhotos = require('./sendPhotos');
var doFaceRecognition = require('./doFaceRecognition');

var insertUserDocs = require('./insertUserDocs');
var getUserDocs = require('./getUserDocs');
 
var dbPath = 'mongodb://localhost/biometric-db';
var mongoose = require('mongoose');
mongoose.connect(dbPath);

mongoose.connection.on('error',function (err) {
  console.log('**********************************************************************************');
  console.error("\n\n++++++ DB ERROR CONNECTION ++++++\n\n");
  console.log('* DB PATH: ' + dbPath);
  console.log('* DB STATE: ' + mongoose.connection.readyState + ' (- 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting)');
  console.log('* DB ERROR: ' + err);
  console.log('**********************************************************************************');
});

mongoose.connection.on('disconnected', function () {
  console.log('**********************************************************************************');
  console.error("\n\n++++++ DB ERROR DISCONNECTED ++++++\n\n");
  console.log('* DB PATH: ' + dbPath);
  console.log('* DB STATE: ' + mongoose.connection.readyState + ' (- 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting)');
  console.log('**********************************************************************************');
});

app.use(bodyParser.json());
app.use('/public', express.static('public'));

app.use('/sendPhotos', sendPhotos);
app.use('/doFaceRecognition', doFaceRecognition);

app.use('/insertUserDocs', insertUserDocs);
app.use('/getUserDocs', getUserDocs);

app.get('/testConnection', function(req, res){
    res.send('si tutt appost');
});

app.listen(port, function(err) {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log('sto andando sulla porta 3000');
});



