var express = require('express');
var router = express.Router();
const apiData = require("../services/api_data.js");

/* GET home page. */
router.get('/', function(req, res, next) {
    apiData.getHomeData().then(data => {
        res.render('index', {page:'Home', menuId:'home', data: data});
    })
});

/* GET folder page. */
router.get('/folder/:folderId', function(req, res, next) {
    const folderId = req.params.folderId;
    apiData.getFolderData(folderId).then(data => {
        res.render('folder', {page:data.data.name, menuId:'', data: data});
    }).catch(error => {
        console.log(error)
    })
});

/* GET file pages. */
router.get('/file/:fileId', function(req, res, next) {
    const fileId = req.params.fileId;
    apiData.getFolderData(fileId).then(data => {
        res.render('file', {page:data.data.name, menuId:'', data: data});
    }).catch(error => {
        console.log(error)
    })
});

/* GET download file. */
router.get('/download/:fileId', function(req, res, next) {
    apiData.updateDownloadCount();
    const fileId = req.params.fileId;
    res.redirect(`https://drive.google.com/uc?id=${fileId}&export=download`);
});

module.exports = router;
