const express = require('express');
var router = express.Router();
const multer = require('multer');
var User = require('./models/User');

var currentDocToSave;

var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./public");
     },
     filename: function(req, file, callback) {
        console.log("file ", file);

        currentDocToSave = file.originalname;

        callback(null, file.originalname);
        }
 });

var upload = multer({ storage: Storage }).any();

router.get("/", function(req, res) {
    return res.status(404).json({status:'KO', message:'Method not allowed'});
 });

 router.post("/", function(req, res) {
        console.log("router post INSERT USER DOCS");

        upload(req, res, function(err) {
        var username = req.body.username;

        User.find({'username': username}, function(err, userFound){

            console.log('userFound from Mongo: ', userFound);

            if(err) return res.status(200).json({status:'KO', message:'ops! ' + err, listDoc: ''});

            var tempDoc = [];
            var resultUser;
            if(!userFound || userFound.length == 0){
              console.log('user not found');

                userFound = new User({
                    'username':username,
                    'listDocument':[]
                });
                resultUser = userFound;
                console.log('userFound created');


            }else {
              resultUser = userFound[0];
              console.log('user just present');

            }

            //save path document in MongoDB
            tempDoc = resultUser.listDocument;
            tempDoc.push(currentDocToSave);
            resultUser.listDocument = tempDoc;
            resultUser.save();

            return res.status(200).json({status:'OK', message:'document correctly saved!'});
        });
     });
 });

module.exports = router;
