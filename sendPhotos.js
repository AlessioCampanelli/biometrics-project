const express = require('express');
var router = express.Router();
const multer = require('multer');


var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./images");
     },
     filename: function(req, file, callback) {
        console.log("file ", file);
        callback(null, file.originalname);
        }
 });

var upload = multer({ storage: Storage }).any();


 router.get("/", function(req, res) {
    return res.status(404).json({status:'KO', message:'Method not allowed'});

 });


 router.post("/", function(req, res) {
        console.log("router post ");
        upload(req, res, function(err) {
        var username = req.body.username;

         if (err) {
             return res.end("Something went wrong! " + err);
         }
         return res.end("File uploaded sucessfully! for: " + username);
     });
 });

module.exports = router;

