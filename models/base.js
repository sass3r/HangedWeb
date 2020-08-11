var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ahorcado');

var PlayerSchema = new mongoose.Schema({
  playername: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  score: {
    type: String,
    required: true
  }

});

var Player = mongoose.model('Player',PlayerSchema);
var registerPlayer = function(username, scorePoints) {
  var player = new Player({
    playername: username,
    score: scorePoints
  });

  player.save(function(err,player){
    if(err){
      console.log("error de insercion");
    }else{
      console.log(player);
    } 
  });
}

var getAllPlayers = function(callback,res) {
	Player.find({},function(err,user){
		if(!err){
			callback(res,user)
		}
	});
}

module.exports.Player = Player;
module.exports.registerPlayer = registerPlayer;
module.exports.getAllPlayers = getAllPlayers;
