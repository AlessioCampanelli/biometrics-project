const express = require('express')
var router = express.Router();
const multer = require('multer');

var upload = multer({
     storage: Storage
 }).array("imgUploader", 3);


var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./images");
     },
     filename: function(req, file, callback) {
         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
     }
 });


 router.get("/", function(req, res) {
    return res.status(404).json({status:'KO', message:'Method not allowed'});

 });


 router.post("/uploadImages", function(req, res) {
     upload(req, res, function(err) {
         if (err) {
             return res.end("Something went wrong!");
         }
         return res.end("File uploaded sucessfully!.");
     });
 });
