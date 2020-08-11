var palabra = undefined;
var adivinar = "";
var score = {};
var scores = [];
var frases = undefined;

(function () {
  let minutos = 0;
  let segundos = 0;
  let minutosTag = document.getElementById("minutos");
  let segundosTag = document.getElementById("segundos");
  let boton = document.getElementById("boton");
  let botonPlayer = document.getElementById("botonPlayer");
  boton.addEventListener("click", play);
  botonPlayer.addEventListener("click", registerPlayer);

  setInterval(function() {
    segundos += 1;
    setTimerValue(segundos,segundosTag);
    if(segundos == 60) {
      minutos += 1;
      segundos = 0;
      setTimerValue(minutos,minutosTag);
    }
  },1000)

  fetch("http://localhost:8080/phrase")
	.then(response => { 
		var data = response.json();
		data.then(function(value){
			console.log(value);
			frases = value;
			let random = Math.floor(Math.random() * 8);
			palabra = frases[random];
			console.log(palabra);
  			iniciarJuego();
		})
	});

})();

function setTimerValue(value, tag) {
  let stringValue = value.toString();
  if(stringValue.length > 1) {
    tag.innerHTML = value;
  }else{
    stringValue = "0"+value;
    tag.innerHTML = stringValue;
  }
}

function iniciarJuego() {
  let fraseTag = document.getElementById("frase");
  for(let i = 0; i < palabra.length; i++){
    adivinar += "_ ";
  }
  adivinar = adivinar.trim();
  fraseTag.innerHTML = adivinar;
}

function adivinarLetra(letra) {
  let adivinarArray = adivinar.split(" ");
  let fraseTag = document.getElementById("frase");
  let adivinarTemp = "";
  for(let i = 0; i < palabra.length; i++){
    if(letra == palabra[i]){
      adivinarArray[i] = letra;
    }
  }

  for(let i = 0; i < adivinarArray.length; i++){
    adivinarTemp += adivinarArray[i] + " ";  
  }
  adivinarTemp = adivinarTemp.trim(); 
  adivinar = adivinarTemp;
  fraseTag.innerHTML = adivinarTemp;
  verificarGanador();
}

function verificarGanador() {
  let jugadorDiv = document.getElementById("player");
  let scoreDiv = document.getElementById("puntuacion");
  let palabraFinal = "";
  for(let i = 0; i < adivinar.length; i++) {
    if(adivinar[i] != " "){
      palabraFinal += adivinar[i];
    }
  }
  console.log(palabraFinal);
  if(palabraFinal == palabra){
    alert("Felicidades Ganaste Registra Tu Victoria");
    jugadorDiv.style["display"] = "block";
    scoreDiv.style["display"] = "block";
    score = {
              name: "undefined",
              score: 1
    };
  }
}

function registerPlayer() {
  let player = document.getElementById("nombre");
  score["name"] = player.value;
  enviarJSON(score);
  fetchScores();
}

function showScore() {
  console.log(scores);
  for(let i = 0; i < scores.length; i++) {
    console.log(scores[i]);
    let tabla = document.getElementById("tabla");
    let nodeTr = document.createElement("tr");
    let playerTd = document.createElement("td");
    let scoreTd = document.createElement("td");
    playerTd.innerHTML = scores[i].playername;
    scoreTd.innerHTML = scores[i].score;
    nodeTr.appendChild(playerTd);
    nodeTr.appendChild(scoreTd);
    tabla.appendChild(nodeTr);
  }
}

function play() {
  let input = document.getElementById("entrada");
  console.log(input.value);
  adivinarLetra(input.value);
}

function enviarJSON(json) {
  console.log(json);
  let xmlHttpRequest = new XMLHttpRequest();
  let action = "http://localhost:8080/";
  xmlHttpRequest.open("POST",action,true);
  xmlHttpRequest.setRequestHeader('Content-Type','application/json');
  xmlHttpRequest.onreadystatechange = function(respuesta){
    if(xmlHttpRequest.readyState == 4){
      if(xmlHttpRequest.status == 200){
        let response = respuesta.target.response;
        console.log(response);
      }
    }
  };
  jsonData = JSON.stringify(json);
  xmlHttpRequest.send(jsonData);
}

function fetchScores() {
  fetch("http://localhost:8080/score")
	.then(response => { 
		var data = response.json();
		data.then(function(value){
			console.log(value);
			scores = value;
			showScore();
		})
	});

}
