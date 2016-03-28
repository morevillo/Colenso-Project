var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 8080, "admin", "admin");

/* GET home page. */
router.get('browse', function(req, res, next) {
  client.execute("XQUERY declare namespace tei='http://www.tei-c.org/ns/1.0'; " + "(doc('Colenso/McLean/private_letters/PrLMcL-0024.xml')//tei:p)[1]",
  	function(error, result){
  		if(error){
  			console.error(error);
  		}else{
  			res.render('browse', { title: 'Colenso Project', place: result.result});
  		}
  	});
  //res.render('browse', { title: 'Colenso Project' });
});


module.exports = router;
