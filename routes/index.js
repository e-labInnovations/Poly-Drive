var express = require('express');
var router = express.Router();
const apiData = require("../services/api_data.js");

/* GET home page. */
router.get('/', function(req, res, next) {
    apiData.getHomeData().then(data => {
        res.render('index', {page:'Home', menuId:'home', data: data});
    })
});

router.get('/folder/:folderId', function(req, res, next) {
    const folderId = req.params.folderId;
    apiData.getFolderData(folderId).then(data => {
        res.render('folder', {page:data.data.name, menuId:'', data: data});
    }).catch(error => {
        console.log(error)
    })
});


module.exports = router;
