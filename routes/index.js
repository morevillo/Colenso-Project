var express = require('express');
var router = express.Router();

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});
router.use(upload.single('file'));

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
  			res.render('browse', { title: 'Browse Page', place: result.result.split('\n')});
  		}
  	});
  //res.render('browse', { title: 'Colenso Project' });
});

/*GET dowload file*/
router.get('/download', function(req, res, next) {
	var file = req.query.document;
	client.execute("XQUERY doc('Colenso/" + file +"')", 
		function(error, result){
			if(error){
				console.error(error);
			}else{				
				res.writeHead(200, {'Content-Disposition': 'attachment; fileName=' + file});
				res.write(result.result);
				res.end('ok');
			}
		});	
});

/*GET delete item*/
router.get('/delete', function(req, res, next){
	var file = req.query.document;
	client.execute('DELETE ' + file,
		function(error, result){
			if(error){
				console.error(error);
			}else{
				res.render('browse', {title: 'Browse Page', deleteFile: true});
			}
		});

	res.render('browse', {title: 'Browse Page', deleteFile: false});
})

/*GET add page*/
router.get('/add', function(req, res, next) {	
	res.render('add', { title: 'Add page'});
});

/*POST to upload file */
router.post('/add', function(req, res, next){
	var fileName = req.file.originalname;
	var buff = req.file.buffer.toString();
	//console.log("Entering POST");
	if(req.file){
		//console.log("ENTERING if");
		client.execute('ADD TO Colenso/new/'+ fileName + ' "'+ buff +'"',
		function(error, result){
			if(error){
				res.status(500).send(error);
			}else{
				console.log("File has been uploaded");
				res.render('add', { title: 'Add page', upload: true});
			}
		});
	}	else{
		res.render('add', { title: 'Add page', upload: false});
	}
});

/*GET search page*/
router.get('/find', function(req, res, next) {
	var title = req.query.docTitle;
	var querySearch = req.query.queryFile;
	var logicSearch = req.query.logicQuery;
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
	  			res.render('find', { title: 'Search page', search_result: result.result.split('\n')});
	  		}
	  	});
	 }
	}
	else if(querySearch){
	  if(querySearch !== undefined){
	    //var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; for $t in //text where matches($t, '" + title + "', 'i') return db:path($t)";
		var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';  " + "for $t in "+ querySearch +" return db:path($t)";
		console.log(query);
	 	client.execute(query,
	  	function(error, result){
	  	    if(error){
	  			console.error(error);
	  		}else{
	  			console.log("RESULT IS: " + result.result);
	  			res.render('find', { title: 'Search page', search_result: result.result.split('\n')});
	  		}
	  	});
	 }
	}
	else if(logicSearch){
	  var logicString = "'" + logicSearch + "'";
	  logicString = logicString.replace(" AND ", '\' ftand \'').replace(" OR ", '\' ftor \'').replace(" NOT ", '\' ftnot \'');
	  var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';  " + "for $t in //TEI[. contains text "+ logicString +" using wildcards] return db:path($t)";
	  client.execute(query,
	  	function(error, result){
	  		if(error){
	  			console.error(error);
	  		}else{
	  			console.log("RESULT IS: " + result.result);
	  			res.render('find', {title: 'Search Page', search_result: result.result.split('\n')});
	  		}
	  	});
	}
	else{
  	  res.render('find', { title: 'Search page', search_result: []});
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
  			res.render('file', {title: 'File Page', place: result.result, fileName: author+"/"+fileType+"/"+xmlFile});
  		}
  	});
});


module.exports = router;
