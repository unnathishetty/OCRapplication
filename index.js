const express = require('express');
const tesseract = require("node-tesseract-ocr")
const app =express();
const port = 5000;
const path = require('path')

app.use(express.static(path.join(__dirname + '/uploads')))

const multer = require('multer')

app.set('view engine', "ejs")

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename:function(req, file, cb){
    cb(null, file.originalname);
  },
});

const upload= multer({storage: storage})

app.get('/', (req,res) => {
  res.render('app', {data: ''})
})

app.post('/extracttextfromimage',upload.single('file'), (req,res) => {
  console.log(req.file.path)

  const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
  }
  
  tesseract
    .recognize(req.file.path, config)
    .then((text) => {
      console.log("Result:", text)

      res.render('app', {data:text})
    })
    .catch((error) => {
      console.log(error.message)
    })
})

 app.listen(port, () => {
  console.log(`server listening on ${port}`)
 })