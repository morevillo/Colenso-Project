var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 8080, "admin", "admin");
client.execute("OPEN Colenso");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Colenso Project' });
});

/*GET browse page*/
router.get('/browse', function(req, res, next) {
  client.execute("XQUERY declare namespace tei='http://www.tei-c.org/nx/1.0'; " + "db:list('Colenso')",
  	function(error, result){
  		if(error){
  			console.error(error);
  		}else{  			
  			//console.log(result);
  			//var xml_list = result.split("\\r?\\n");
  			res.render('browse', { title: 'Browse Page', place: result.result.split('\n')});
  		}
  	});
  //res.render('browse', { title: 'Colenso Project' });
});

/*GET browse page*/
router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Add page' });
});

/*GET search page*/
router.get('/find', function(req, res, next) {
	var title = req.query.docTitle;
	var querySearch = req.query.queryFile;
	if(title){
		if(title !== undefined){
		var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in //text where matches($t, '" + title + "', 'i') return db:path($t)";
		//var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';  " + "for $t in "+title+" return db:path($t)";
		console.log(query);
	 	client.execute(query,
	  	function(error, result){
	  		if(error){
	  			console.error(error);
	  		}else{
	  			console.log("RESULT IS: " + result.result);
	  			res.render('find', { title: 'Find page', search_result: result.result.split('\n')});
	  		}
	  	});
	 }
	}
	else if(querySearch){
		if(querySearch !== undefined){
		//var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in //text where matches($t, '" + title + "', 'i') return db:path($t)";
		var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';  " + "for $t in "+querySearch+" return db:path($t)";
		console.log(query);
	 	client.execute(query,
	  	function(error, result){
	  		if(error){
	  			console.error(error);
	  		}else{
	  			console.log("RESULT IS: " + result.result);
	  			res.render('find', { title: 'Find page', search_result: result.result.split('\n')});
	  		}
	  	});
	 }
	}	
	else{
  	  res.render('find', { title: 'Find page', search_result: []});
	}
});

/*GET files page depending on the xml file selected*/
router.get('/:author/:fileType/:xmlFile', function(req, res, next){
  var author = req.params.author;
  var fileType = req.params.fileType;
  var xmlFile = req.params.xmlFile;

  client.execute("XQUERY declare namespace tei='http://www.tei-c.org/nx/1.0'; " + "doc('Colenso/" + author + "/" + fileType + "/" + xmlFile + "')",
  	function(error, result){
  		if(error){
  			console.error(error);
  		}else{
  			res.render('file', {title: 'File Page', place: result.result});
  		}
  	});
});


module.exports = router;
