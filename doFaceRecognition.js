const express = require('express'); 
var router = express.Router(); 
const multer = require('multer'); 	
const fs = require('fs');
const path = require('path');
//const cv2 = require('opencv');
const cv = require('opencv4nodejs');
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
const basePath = './';
//const imgsPath = path.resolve(basePath, 'testFolder');

var  imgsPath = path.resolve(basePath, 'images');
var  nameMappings = ['A','B','C','D'];
var  pathImg_username;

var imgFiles;

const getFaceImage = (grayImg) => {
  const faceRects = classifier.detectMultiScale(grayImg).objects;
  if (!faceRects.length) {
    throw new Error('failed to detect faces');
  }
  return grayImg.getRegion(faceRects[0]);
};



var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
        //var username = req.body.username;
      
     var nameFolder = file.originalname.substring(0,file.originalname.length-4);
     var user = nameFolder.substring(0,nameFolder.length-1);
     pathImg_username = './images/'+user;
     imgsPath = path.resolve(basePath, pathImg_username);
     nameMappings = [user]; 
	callback(null,pathImg_username);
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
               if (err.code === 'ENOENT') {
		return res.status(200).json({status:'KO_NOT_EXIST', message:'register before using app!'});
		}
                return res.status(200).json({status:'KO_GENERIC', message:'Something went wrong! '+err});
                //return res.end("Something went wrong! " + err);
            }
	    //FACE RECOGNITION
	   imgFiles = fs.readdirSync(imgsPath); 
           recognitionPhase(username, res);
	
     });
 });


function recognitionPhase(username, res){
	const images = imgFiles
	  // get absolute file path
	  .map(file => path.resolve(imgsPath, file))
	  // read image
	  .map(filePath => cv.imread(filePath))
	  // face recognizer works with gray scale images
	  .map(img => img.bgrToGray())
	  // detect and extract face
	  .map(getFaceImage)
	  // face images must be equally sized
	  .map(faceImg => faceImg.resize(80, 80));



	const isImageFour = (_, i) => imgFiles[i].includes('4');
	const isNotImageFour = (_, i) => !isImageFour(_, i);
	// use images 1 - 3 for training
	const trainImages = images.filter(isNotImageFour);
	// use images 4 for testing
	const testImages = images.filter(isImageFour);
	// make labels
	const labels = imgFiles
	  .filter(isNotImageFour)
	  .map(file => nameMappings.findIndex(name => file.includes(name)));

	console.log("labels: "+labels)

	//TRAINING
	const eigen = new cv.EigenFaceRecognizer();
	//const fisher = new cv.FisherFaceRecognizer();
	//const lbph = new cv.LBPHFaceRecognizer();
	eigen.train(trainImages, labels);
	//fisher.train(trainImages, labels);
	//lbph.train(trainImages, labels);



 	var statusResp;
	var l = testImages.length;
        console.log('testImages.lenth' + testImages.length);        
	console.log('NameMappings '+nameMappings)
        var found=false;
	const runPrediction = (recognizer, callback) => {
	  testImages.forEach((img) => {
	    const result = recognizer.predict(img);
	    const name = nameMappings[result.label];
	    console.log('predicted: %s, confidence: %s', nameMappings[result.label], result.confidence);
            console.log('name = '+name +' username= '+username);	    
	    if(name === username){
                found=true;           
		
		if(result.confidence === 0 || result.confidence <= 2000){
			statusResp= "OK"; 
		}else if(result.confidence > 2000){
			statusResp="RETRY";		
	        
	        }else{
			statusResp="KO";		
	        }
 
		console.log('Pre callback - statusResp '+statusResp);
                callback(statusResp);
                return;
            }
            
     
	   // cv.imshowWait('face', img);
	   // cv.destroyAllWindows();
	  });
          

          if(!found){
              statusResp ="KO_NOT_EXIST";
              callback(statusResp);
          }

	};
         
     



	console.log('eigen:');
	runPrediction(eigen, function(statusResp){
	    console.log('Post callback - statusResp '+statusResp);
     
            fs.unlinkSync(pathImg_username + '/' + username + '4.jpg', function(errRemove){
		if(errRemove)
		 return res.status(200).json({status:'KO', message:'ops! Something went wrong '+ errRemove  });
	    });	   
      
	    if(statusResp === "OK"){
                        return res.status(200).json({status:'OK', message:'you are '+username});
            }else if(statusResp=== "RETRY"){
                        return res.status(200).json({status:'KO', message:'ops! you aren\'t '+username+ ' retry'});

            }else if(statusResp=== "KO_NOT_EXIST"){
                        return res.status(200).json({status:'KO_NOT_EXIST', message:'register before use the app'});

            }else{
                        return res.status(200).json({status:'KO', message:'ops! you aren\'t '+username });
            }

	});

	//console.log('fisher:');
	//runPrediction(fisher);

	//console.log('lbph:');
	//runPrediction(lbph);
	 

}


module.exports = router;
