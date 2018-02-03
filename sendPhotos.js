const express = require('express'); 
var router = express.Router(); 
const multer = require('multer'); 	
var fs =require('fs'); 

var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
     var username = req.body.username;
     var nameFolder = file.originalname.substring(0,file.originalname.length-4);
    
     var pathImgDefault = './images/'+nameFolder.substring(0,nameFolder.length-1);
      console.log('path '+pathImgDefault);
        if(!fs.existsSync(pathImgDefault)){
            fs.mkdirSync(pathImgDefault);
        }
  
      callback(null, pathImgDefault);
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
	 return res.status(200).json({status:'OK', message:'File uploaded sucessfully! for: ' + username});
         
     });
 });

module.exports = router;
