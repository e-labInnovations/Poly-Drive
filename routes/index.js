var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {page:'Home', menuId:'home'});
});

router.get('/folder/:folderId', function(req, res, next) {
  res.render('folder', {page:req.params.folderId, menuId:''});
});


module.exports = router;
