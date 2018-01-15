const express = require('express')
const app = express()
const port = 3000
const multer = require('multer');
const bodyParser = require('body-parser');
var sendPhotos = require('./sendPhotos');
var doFaceRecognition = require('./doFaceRecognition');


app.use(bodyParser.json());
app.use('/public', express.static('public'));

app.use('/sendPhotos',sendPhotos);
app.use('/doFaceRecognition',doFaceRecognition);


app.get('/testConnection', function(req, res){
    res.send('si tutt appost');
});


app.listen(port, function(err) {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log('sto andando sulla porta 3000');
});


