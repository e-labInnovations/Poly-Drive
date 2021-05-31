var express = require('express');
var router = express.Router();
const apiData = require("../services/api_data.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  apiData.updateViewsCount();
  
  apiData.getHomeData().then(data => {
    res.render('index', {page:'Home', menuId:'home', data: data});
  })
});

/* GET folder page. */
router.get('/folder/:folderId', function(req, res, next) {
  apiData.updateViewsCount();
  
  const folderId = req.params.folderId;
  apiData.getFolderData(folderId).then(data => {
    if(data.data) {
      res.render('folder', {page:data.data.name, menuId:'', data: data});
    } else {
      res.render('404', {page:'Error 404', menuId:'', data: data});
    }
  }).catch(error => {
    console.log(error);
  })
});

/* GET file pages. */
router.get('/file/:fileId', function(req, res, next) {
  apiData.updateViewsCount();
      
  const fileId = req.params.fileId;
  apiData.getFolderData(fileId).then(data => {
      if(data.data) {
          res.render('file', {page:data.data.name, menuId:'', data: data});
      } else {
          res.render('404', {page:'Error 404', menuId:'', data: data});
      }
  }).catch(error => {
      console.log(error);
  })
});

/* GET download file. */
router.get('/download/:fileId', function(req, res, next) {
    apiData.updateDownloadsCount();
    const fileId = req.params.fileId;
    res.redirect(`https://drive.google.com/uc?id=${fileId}&export=download`);
});

module.exports = router;
