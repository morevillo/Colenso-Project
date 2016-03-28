var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 8080, "admin", "admin");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('add', { title: 'Colenso Project' });
});


module.exports = router;
