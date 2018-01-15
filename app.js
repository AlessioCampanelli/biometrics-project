
const express = require('express')
const app = express()
const port = 3000
const multer = require('multer');
const bodyParser = require('body-parser');
var sendPhotos = require('/sendphotos');

app.use(bodyParser.json());
app.use('/sendPhotos',sendPhotos);
app.use('/public', express.static('public'));

app.get('/faceRecognition', function(request, response){

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



