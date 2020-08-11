const express = require('express'),
  app = express(),
  port = 8080,
  fs = require('fs'),
  mongoose = require('mongoose'),
  nunjucks = require('nunjucks'),
  models = require('./models/base'),
  bodyParser = require('body-parser');

  nunjucks.configure(__dirname + '/views',{
    express:app
  });

  app.use(bodyParser.urlencoded({
    extended:false 
  }));

  var jsonParser = bodyParser.json()

  app.use(express.static(__dirname+'/views'));

  app.get('/',function(req,res){
    res.render(index.html);
  });

  app.post('/',jsonParser,function(req,res){
    console.log(req.body);
    var playername = req.body.name;
    var scorepoints = req.body.score;
    console.log(playername);
    console.log(scorepoints);
    models.Player.findOne({playername: playername}, function(err,player){
      if(!err && player!=null){
        player.score = parseInt(scorepoints) + 1;
        player.save();
      }else{
        models.registerPlayer(playername,scorepoints);
      }
    });
  
  })

  app.get('/phrase',function(req,res){
	var fileName = "frases.txt";
	fs.readFile(fileName, 'utf8', function(err,data){
		if(!err){
			let array = data.split("\n");
			console.log(array);
			res.json(array);
		}
	});
  })

  function returnData(res,data){
	res.json(data);
  }

  app.get('/score',function(req,res){
        models.getAllPlayers(returnData, res);
  })

  app.listen(port,function(){
    console.log("server started");
  });
