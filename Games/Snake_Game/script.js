let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");  
// draw on the screen to get the context, ask canvas  to get the 2d context

// snake axis
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
// speed of the game
let speed = 7;
// size and count of a tile 
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
// head of the snake
let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;
// apple size
let appleX = 5;
let appleY = 5;
// movement
let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

let gulpSound = new Audio("gulp.mp3");
// Game Over overlay buttons
const overlay = document.getElementById("gameOverOverlay");
const restartBtn = document.getElementById("restartBtn");
const exitBtn = document.getElementById("exitBtn");

const pauseBtn = document.getElementById("pauseBtn");
let isPaused = false;
let gameTimeoutId = null;

// Pause button event
pauseBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
  if (!isPaused) {
    drawGame();
  } else if (gameTimeoutId) {
    clearTimeout(gameTimeoutId);
  }
});

//game loop
function drawGame() {
  if (isPaused) return;

  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }

  clearScreen();

  checkAppleCollision();
  drawApple();
  drawSnake();

  drawScore();

  if (score > 5) {
    speed = 9;
  }
  if (score > 10) {
    speed = 11;
  }

  gameTimeoutId = setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  //walls
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
  overlay.classList.remove("hidden"); // Show Game Over overlay
}
  return gameOver;

}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score " + score, canvas.width - 50, 10);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY)); //put an item at the end of the list next to the head
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); // remove the furthet item from the snake parts if have more than our tail size.
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    gulpSound.play();
    speed++; //To increase the level of difficulty
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  //up
  if (event.keyCode == 38 || event.keyCode == 87) {
    //87 is w
    if (inputsYVelocity == 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  //down
  if (event.keyCode == 40 || event.keyCode == 83) {
    // 83 is s
    if (inputsYVelocity == -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  //left
  if (event.keyCode == 37 || event.keyCode == 65) {
    // 65 is a
    if (inputsXVelocity == 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  //right
  if (event.keyCode == 39 || event.keyCode == 68) {
    //68 is d
    if (inputsXVelocity == -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}


exitBtn.addEventListener("click", () => {
  window.location.href = "../../index.html";  
});
;

const startBtn = document.getElementById("startBtn");
// Start the game when Start button is clicked
startBtn.addEventListener("click", () => {
  startGame();
});  

// Restart the game when Restart button is clicked
restartBtn.addEventListener("click", () => {
  startGame();
});

function startGame() {
  headX = 10;
  headY = 10;
  snakeParts = [];
  tailLength = 2;
  appleX = 5;
  appleY = 5;
  inputsXVelocity = 1;
  inputsYVelocity = 0;
  xVelocity = 0;
  yVelocity = 0;
  score = 0;
  speed = 3;
  overlay.classList.add("hidden"); 

  // Gets hidden once the game start
  startBtn.style.display = "none";
  instruction.style.display = "none";
  note.style.display = "none";
  pauseBtn.style.display = "block";  

  isPaused = false;
  pauseBtn.textContent = "Pause";

  drawGame();
}

startBtn.addEventListener("click", startGame);

function drawInitialBoard() {
  clearScreen();
  drawApple();
  drawSnake();
  drawScore();
}

drawInitialBoard();