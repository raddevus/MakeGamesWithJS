
var boxImage = new Image();
var gridImage = new Image();
var bunnyImage = new Image();
var endGame = new Image();
var imgIdx = 0;
var radius = 10;
var allCircles = [];
var scoreEl = null;
var score = 0;
var countdownEl = null;
var timeLeft = 10;
var isGameRunning = true;
var bestScore = 0;

window.onload = () => {
    initApp();
}

boxImage.src = "../assets/chpt001/box.png";
gridImage.src = "../assets/1stTiled.png";
bunnyImage.src = "../assets/BunnyAlt.png";
endGame.src = "../assets/endGameDialog.png";

var app = null;
var gameArea = null; 
var mouseLoc = null;
const mainCanvasId = "gameArea";
var gridLoc = new Point(0,0);
var charPositions = [64,112,160];
var walkWestImgOffset = 112;
var walkEastImgOffset = 160;
var walkUpImgOffset = 64;
var imgOffset = 16;
var numberOfAnimMoves = 4;
var speed;
const ga_width = 500;
const ga_height = 500;
let avatarWidth = 30;
// basically offset is the avatar center point
let offset = avatarWidth / 2;
let avatarLocX = 230;
let avatarLocY = 230;
let avatarSize = 48;
let avatarCenter = new Point(230+24, 230+24); // 254 & 254 is always center
let timerId = null;
let audioGotDotEl = null;
let audioType = null;
const GOT_DOT_SOUND = "./assets/gotDot0";

function initApp(){
    
    var context = null;
    gameArea = document.querySelector(`#${mainCanvasId}`);
    gameArea.width = ga_width;
    gameArea.height = ga_height;

    speedEl = document.querySelector("#speed");
    speedEl.value = 5;
    speed = speedEl.valueAsNumber;

    speedEl.addEventListener("change", (e) => {
        speed = speedEl.valueAsNumber;
        // set focus to button so that when the arrows keys 
        // are pressed (to move the character) they don't 
        // change the value of the speed control.
        document.querySelector("#snapshot").focus();
      });

    var locationOutput = document.querySelector("#cursor-location");
    gameArea.addEventListener("mousemove", (e)=>{
        mouseLoc = getMousePos(e,gameArea);
        locationOutput.textContent = `${mouseLoc.X} : ${mouseLoc.Y}`;
    });
    generateRandomCircles();

    document.addEventListener("keydown", KeydownHandler);

    let upArrow = document.querySelector("#upMoveArrow");
    let downArrow = document.querySelector("#downMoveArrow");
    let leftArrow = document.querySelector("#leftMoveArrow");
    let rightArrow = document.querySelector("#rightMoveArrow");

    upArrow.addEventListener("touchstart", (e) =>{
        e.preventDefault();
        isMovingUp = true;
        touchMoveHandler("up");
    });

    upArrow.addEventListener("touchend", () =>{
        isMovingUp = false;
        clearTimeout(cancelId);
    });

    downArrow.addEventListener("touchstart", (e) =>{
        e.preventDefault();
        isMovingDown = true;
        touchMoveHandler("down");
    });

    downArrow.addEventListener("touchend", () =>{
        isMovingDown = false;
        clearTimeout(cancelId);
    });

    leftArrow.addEventListener("touchstart", (e) =>{
        e.preventDefault();
        isMovingLeft = true;
        touchMoveHandler("left");
    });

    leftArrow.addEventListener("touchend", () =>{
        isMovingLeft = false;
        clearTimeout(cancelId);
    });

    rightArrow.addEventListener("touchstart", (e) =>{
        e.preventDefault();
        isMovingRight = true;
        touchMoveHandler("right");
    });

    rightArrow.addEventListener("touchend", () =>{
        isMovingRight = false;
        clearTimeout(cancelId);
    });
    scoreEl = document.querySelector("#score");
    countdownEl = document.querySelector("#countdown");
    countdownEl.textContet = timeLeft;
    timerId = setInterval(countdown, 1000);
    app = new App(mainCanvasId);
    Draw();
    readBestScoreFromLS();
    initSound();
}

function KeydownHandler(e){
    // moved this from the anonymous function 
    // so we can more easily remove the event listener.
        switch (e.key){
            case "ArrowUp":{
                moveUp(true);
                break;
            }
            case "ArrowDown":{
                moveDown(true);
                break;
            }
            case "ArrowLeft":{
                moveLeft(true);
                break;
            }
            case "ArrowRight":{
                moveRight(true);
                break;
            }
        }
}

function readBestScoreFromLS(){
    // read best score from localStorage
    bestScore = localStorage.getItem("bestScore");
    if (!bestScore) {bestScore = 0;}
}

function writeBestScoreToLS(newScore){
    // write best score to localStorage
    if (newScore > bestScore){
        localStorage.setItem("bestScore",newScore)
        bestScore = newScore;
    }
}

function countdown(){
    if (timeLeft == 1){
        clearInterval(timerId);
        StopInput();
        DrawGameEnd();
        writeBestScoreToLS(score);
        DrawScore();
    }
    countdownEl.textContent = --timeLeft;
}

function initSound(){
    audioGotDotEl = document.querySelector("#gotDotAudio");
	audioType = supportedAudioFormat(audioGotDotEl);
    console.log(`audioType ${audioType}`);
}

function supportedAudioFormat(audio) {
	var returnExtension = "";
	if (audio.canPlayType("audio/ogg") =="probably" || audio.canPlayType("audio/ogg") == "maybe") {
		returnExtension = "ogg";
	} else if(audio.canPlayType("audio/wav") =="probably" || audio.canPlayType("audio/wav") == "maybe") {
		returnExtension = "wav";
	} else if(audio.canPlayType("audio/mp3") == "probably" || audio.canPlayType("audio/mp3") == "maybe") {
		returnExtension = "mp3";
	}
	return returnExtension;
}

 function playSound(sound,volume) {
   var tempSound = document.createElement("audio");
   tempSound.setAttribute("src", sound + "." + audioType);
   tempSound.loop = false;
   tempSound.volume = volume;
   tempSound.play();
   //sounds.push(tempSound);
}

function StopInput(){
    isGameRunning = false;
    document.removeEventListener("keydown", KeydownHandler);
}

function DrawGameEnd(){
    app.context.drawImage(endGame,50, 50,317,240);
}

function DrawScore(){
    //app.context.textBaseline = textBaseline;
    app.context.textAlign = "center";
    app.context.font = `bold 40px serif`;
    
    
    app.context.shadowColor ="707070";
    app.context.shadowOffsetX = 5;
    app.context.shadowOffsetY = 5;
    app.context.shadowBlur = 6;
    
    // app.context.globalAlpha = textAlpha;
    
    
    var xPosition = 310;
    var yPosition = 205;
    var bestScoreY = 265;
    
    app.context.fillStyle    = "light-blue";
    app.context.fillText  ( score,  xPosition ,yPosition);
    app.context.strokeStyle = "#000000";
    app.context.strokeText  ( score, xPosition,yPosition);
    
    app.context.fillStyle    = "light-blue";
    app.context.fillText  ( bestScore,  xPosition ,bestScoreY);
    app.context.strokeStyle = "#000000";
    app.context.strokeText  ( bestScore, xPosition,bestScoreY);
}

var isMovingUp = false;
var isMovingDown = false;
var isMovingLeft = false;
var isMovingRight = false;
var cancelId = null;

function touchMoveHandler(direction){
    if (!isGameRunning){
        // insures that after game end 
        // that the user cannot move the avatar
        return;
    }
    switch (direction){
        case "up":{
            if (isMovingUp){
                cancelId = setTimeout(moveUp, 35);
                console.log("set thte timeout...");
            }
            break;
        }
        case "down":{
            console.log("got down...");
            if (isMovingDown){
                cancelId = setTimeout(moveDown, 35);
                console.log("set thte timeout...");
            }
            break;
        }
        case "left":{
            if (isMovingLeft){
                cancelId = setTimeout(moveLeft, 35);
                console.log("set thte timeout...");
            }
            break;
        }
        case "right":{
            if (isMovingRight){
                cancelId = setTimeout(moveRight, 35);
                console.log("set thte timeout...");
            }
            break;
        }
    }

}
function moveUp(isKey){
    if (!isGameRunning){
        // insures that after game end 
        // that the user cannot move the avatar
        return;
    }
    imgOffset = walkUpImgOffset;
    gridLoc.Y += speed;
    ClearCanvas();
    Draw();
    // run code that when isKey isn't defined
    // bec their isn't a way to pass a value into 
    // a method that is called by setTimeout!!!
    if (isKey === undefined){
        touchMoveHandler("up");
    }
}

function moveDown(isKey){
    if (!isGameRunning){
        // insures that after game end 
        // that the user cannot move the avatar
        return;
    }
    imgOffset = 16;
    gridLoc.Y -= speed;
    ClearCanvas();
    Draw();
    // run code that when isKey isn't defined
    // bec their isn't a way to pass a value into 
    // a method that is called by setTimeout!!!
    if (isKey === undefined){
        touchMoveHandler("down");
    }
}

function moveLeft(isKey){
    if (!isGameRunning){
        // insures that after game end 
        // that the user cannot move the avatar
        return;
    }
    imgOffset = walkWestImgOffset;
    gridLoc.X += speed;
    ClearCanvas();
    Draw();
    // run code that when isKey isn't defined
    // bec their isn't a way to pass a value into 
    // a method that is called by setTimeout!!!
    if (isKey === undefined){
        touchMoveHandler("left");
    }
}

function moveRight(isKey){
    if (!isGameRunning){
        // insures that after game end 
        // that the user cannot move the avatar
        return;
    }
    imgOffset = walkEastImgOffset;
    gridLoc.X -= speed;
    ClearCanvas();
    Draw();
    // run code that when isKey isn't defined
    // bec their isn't a way to pass a value into 
    // a method that is called by setTimeout!!!
    if (isKey === undefined){
        touchMoveHandler("right");
    }
}

function generateRandomCircles(){
    for (var i = 0; i < 100;i++){
        
        var x = (getRandom(40) + 1) * 25;
        var y = (getRandom(40) + 1) * 25;
        // gen random color
        var r = getRandom(255);
        var g = getRandom(255);
        var b = getRandom(255);
        var rndColor = `rgb(${r}, ${g}, ${b})`;
        // gen random-ish point
        var p = new Point(x,y)
        allCircles.push(new Circle(p,rndColor));
    }
}

function DrawRandomCircles(){

    allCircles.forEach(c => {
     
     // Begin a new path
     app.context.beginPath();
     // Draw the circle
     app.context.arc(c.Point.X + gridLoc.X, c.Point.Y + gridLoc.Y, radius, 0, 2 * Math.PI, false);
     // Set the fill color
     app.context.fillStyle =  c.Color;
     // Fill the circle with the color
     app.context.fill();
     // Set the border color
     app.context.strokeStyle = 'black';
     // Draw the border
     app.context.stroke();
    });
}

function ClearCanvas(){
    app.context.clearRect(0,0,ga_width,ga_height);
    app.context.fillStyle = 'rgba(0, 0, 0, 0.0)';
    app.context.fillRect(0, 0, ga_width,ga_height);
}

function Draw(){
    
    app.context.drawImage(gridImage,gridLoc.X, gridLoc.Y,2560,2560);
    DrawRandomCircles();
    app.context.drawImage(bunnyImage, charPositions[imgIdx], imgOffset, 16, 16, avatarLocY, avatarLocY, avatarSize, avatarSize);
    imgIdx = ++imgIdx % (numberOfAnimMoves -1);
    //app.context.drawImage(bunnyImage, 230, 230,avatarWidth,avatarWidth);
    let hitSuccess = hitTest(allCircles);
    if (hitSuccess){
        // console.log(`hitSuccess: ${hitSuccess.Point.X} : ${hitSuccess.Point.Y} ${hitSuccess.Color}`);
        allCircles.includes(hitSuccess) && allCircles.splice(allCircles.indexOf(hitSuccess), 1);
        playSound(GOT_DOT_SOUND,1);
        scoreEl.textContent = score+=10;
        timeLeft += 2;
        // needs to call Draw() again, bec
        // the dot needs to disappear since
        // it has been hit (collected by sprite)
        Draw();
    }
}

function hitTest(hitTestObjArray)
{
    var avatarMin = avatarLocX + 6;
    var avatarMax = avatarLocX + 36;
  for (var k = 0;k < hitTestObjArray.length; k++)
  {
    
    var testObjXmin = hitTestObjArray[k].Point.X + gridLoc.X - radius;
	var testObjXmax = hitTestObjArray[k].Point.X + gridLoc.X + radius; // size of the circle
    var testObjYmin = hitTestObjArray[k].Point.Y + gridLoc.Y - radius;
	var testObjYmax = hitTestObjArray[k].Point.Y + gridLoc.Y + radius;
    
    if ( isInRange(testObjXmax,avatarMin,avatarMax) && isInRange(testObjYmax, avatarMin, avatarMax)
    || isInRange(testObjXmin,avatarMin,avatarMax) && isInRange(testObjYmin, avatarMin, avatarMax)){
        return hitTestObjArray[k];
    }
  }
  return null;
}

function isInRange(value, min, max) {
    return value >= min && value <= max;
}


function takeSnap(){
    var gameArea = document.querySelector(`#${mainCanvasId}`);
    var snapEl = document.querySelector("#snapout");
    console.log(gameArea.toDataURL());
    snapEl.src = gameArea.toDataURL();
}

function getRandom(max){
    // returns 0 to max-1
    // if you want 1 to max simply add 1 to result
	return Math.floor((Math.random() * max));
}

class App{

    // pass the id of canvas element that you want to 
    // use to draw on
    constructor(canvasId){
        this.gameArea = document.querySelector(`#${canvasId}`);
        this.context = this.gameArea.getContext("2d");
    }
}

class Circle{
    constructor(point, color){
        this.Point = point;
        this.Color = color;
    }
}