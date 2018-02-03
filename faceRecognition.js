const fs = require('fs');
const path = require('path');
//const cv2 = require('opencv');
const cv = require('opencv4nodejs');
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
const basePath = './';
const imgsPath = path.resolve(basePath, 'testFolder');
const nameMappings = ['A','B','C','D'];

const imgFiles = fs.readdirSync(imgsPath);
console.log("imgFiles"+ imgFiles)

const getFaceImage = (grayImg) => {
  const faceRects = classifier.detectMultiScale(grayImg).objects;
  if (!faceRects.length) {
    throw new Error('failed to detect faces');
  }
  return grayImg.getRegion(faceRects[0]);
};



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
const fisher = new cv.FisherFaceRecognizer();
const lbph = new cv.LBPHFaceRecognizer();
eigen.train(trainImages, labels);
fisher.train(trainImages, labels);
lbph.train(trainImages, labels);




const runPrediction = (recognizer) => {
  testImages.forEach((img) => {
    const result = recognizer.predict(img);
    console.log('predicted: %s, confidence: %s', nameMappings[result.label], result.confidence);
   // cv.imshowWait('face', img);
   // cv.destroyAllWindows();
  });
};


console.log('eigen:');
runPrediction(eigen);

console.log('fisher:');
runPrediction(fisher);

console.log('lbph:');
runPrediction(lbph);





// load image from file
//const mat = cv.imread('./path/img.jpg');
//cv.imreadAsync('./path/img.jpg', (err, mat) => {
  

//})

// save image
//cv.imwrite('./path/img.png', mat);
//cv.imwriteAsync('./path/img.jpg', (err) => {
  
//})







/*
function forEachFileInDir(dir, cb) {
  let f = fs.readdirSync(dir);
  f.forEach(function (fpath, index, array) {
    if (fpath != '.DS_Store')
     cb(path.join(dir, fpath));
  });
}

let dataDir = "./trainingFolder";
function trainIt (fr) {
  // if model existe, load it
  if ( fs.existsSync('./trained.xml') ) {
    fr.loadSync('./trained.xml');
    return;
  }

  // else train a model
  let samples = [];
  forEachFileInDir(dataDir, (f)=>{
      cv.readImage(f, function (err, im) {
          // Assume all training photo are named as id_xxx.jpg
          let labelNumber = parseInt(path.basename(f).substring(3));
          samples.push([labelNumber, im]);
      })
  })

  if ( samples.length > 3 ) {
    // There are async and sync version of training method:
    // .train(info, cb)
    //     cb : standard Nan::Callback
    //     info : [[intLabel,matrixImage],...])
    // .trainSync(info)
    fr.trainSync(samples);
    fr.saveSync('./trained.xml');
  }else {
    console.log('Non ci sono piu foto da caricare', cvImages)
  }
}

function predictIt(fr, f){
  cv.readImage(f, function (err, im) {
    let result = fr.predictSync(im);
    console.log(`recognize result:(${f}) id=${result.id} conf=${100.0-result.confidence}`);
  });
}

//using defaults: .createLBPHFaceRecognizer(radius=1, neighbors=8, grid_x=8, grid_y=8, threshold=80)
const fr = new cv.FaceRecognizer();
trainIt(fr);
forEachFileInDir('./bench', (f) => predictIt(fr, f));
*/
