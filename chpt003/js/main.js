// chpt003 - main.js
var boxImage = new Image();
    
window.onload = () => {
    initApp();
}
boxImage.src = "../assets/chpt001/box.png";

function initApp(){
    var context = null;
    var gameArea = document.querySelector("#gameArea");
    var locationOutput = document.querySelector("#cursor-location");
    gameArea.addEventListener("mousemove", (e)=>{
        var loc = getMousePos(e,gameArea);
        locationOutput.textContent = `${loc.X} : ${loc.Y}`;
    });

    context = gameArea.getContext("2d");
    context.drawImage(boxImage, 20, 20);
    context.fillStyle  = "#000000";
    context.font = "15px Sans-Serif";
    context.textBaseline = "top";
    context.fillText("<--- image on CANVAS", 50,20);
}

function takeSnap(){
    var gameArea = document.querySelector("#gameArea");
    context = gameArea.getContext("2d");
    var snapEl = document.querySelector("#snapout");
    console.log(gameArea.toDataURL());
    snapEl.src = gameArea.toDataURL();
}