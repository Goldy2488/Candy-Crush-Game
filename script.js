// Create an audio objects
let crushSound = new Audio('./sound/candy-land2-101soundboards.mp3');
let winSound = new Audio('./sound/winSound.mp3');
let wrongMoveSound = new Audio('./sound/wrongMove.mp3');
let looseSound = new Audio('./sound/looseSound.mp3');

let targetScore = document.getElementById("target_score");
let resultElement = document.getElementById("result");
let timerElement = document.getElementById("timer");
let timeLeft;  // Timer variable

const targetScoreObject = {1:1200,2:2000,3:2800,4:3800,5:5000};
const keys = Object.keys(targetScoreObject);
const values = Object.values(targetScoreObject);

let candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
let board = [];
let rows = 9;
let columns = 9;
let score = 0;

// create tiles for Drag and drop functionality 
let currTile; 
let otherTile;

window.onload = () => {
  startGame();
  setTarget();  // Set target score and dynamic timer
  startTimer();  // Start the timer with dynamic time

  // 1/10th of seconds
  window.setInterval(() => {
    crushCandy();
  }, 100);
};

// Function to set target score and time
function setTarget() {
    let randomIndex = Math.floor(Math.random() * Object.keys(targetScoreObject).length - 1) + 1;
    // Use the random index to get the key and value
    let selectedKey = keys[randomIndex];
    let selectedValue = targetScoreObject[selectedKey];

    // Set the target score to the corresponding value
    targetScore.innerText = selectedValue;

    timeLeft = selectedKey * 60;  // Timer is set based on target score
    console.log(`Target Score: ${selectedValue}, Timer Duration: ${timeLeft} seconds`);
}

// Function to start the countdown timer
function startTimer() {
  console.log(timeLeft)
    const timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;  // Decrease the time left by 1 second

        // Calculate minutes and seconds
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        // Format minutes and seconds to always display two digits
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // Update the timer element with formatted time
        timerElement.innerText = `${minutes}:${seconds}`;
      } else {
        clearInterval(timerInterval);  // Stop the timer
        looseSound.play();  // Play loose sound
        resultElement.innerText = "Time's up! You Lose.";
      }

      // Check for win/loss after every update
      if (winning()) {
        clearInterval(timerInterval);  // Stop the timer
      }
    }, 1000);  // Update every second
}

// Function to check winning condition
function winning() {
    if (score >= parseInt(targetScore.innerText) && timeLeft > 0) {
      resultElement.innerText = "Congratulations! You Win The Game";
      winSound.play();
      return true;
    }
    return false;
}

// Function to check losing condition
function loosing() {
    if (timeLeft <= 0 && score < parseInt(targetScore.innerText)) {
      resultElement.innerText = "Time's up! You Lose.";
      looseSound.play();  // Play lose sound
      return true;
    }
    return false;
}

// Generate Random candy  
let randomCandy = () => {
  return candies[Math.floor(Math.random() * candies.length)]; //0-5
};

function startGame() {
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      // Create img tag for tile
      let tile = document.createElement("img");
      tile.id = r.toString() + "-" + c.toString();
      tile.src = "./images/" + randomCandy() + ".png";

      // Drag Functionality
      tile.addEventListener("dragstart", dragStart); // click on a candy, initialized drag process
      tile.addEventListener("dragover", dragOver); // clicking on candy, moving mouse to drag the candy
      tile.addEventListener("dragenter", dragEnter); // dragging candy onto another candy
      tile.addEventListener("dragLeave", dragLeave); // leave candy over another candy
      tile.addEventListener("drop", dragDrop); // dropping the candy over another
      tile.addEventListener("dragend", dragEnd); // after drag process completed, swap candies

      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }
}

// Drag functions
function dragStart() {
  currTile = this;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
  otherTile = this;
}

function dragEnd() {
  if(currTile.src.includes("blank") || otherTile.src.includes("blank")) {
    return;
  }

  let currCoards = currTile.id.split("-");
  let r = parseInt(currCoards[0]);
  let c = parseInt(currCoards[1]);

  let otherCoards = otherTile.id.split("-");
  let r2 = parseInt(otherCoards[0]);
  let c2 = parseInt(otherCoards[1]);

  let moveLeft = c2 == c - 1 && r == r2;
  let moveRight = c2 == c + 1 && r == r2; 
  let moveUp = r2 == r - 1 && c == c2;
  let moveDown = r2 == r + 1 && c == c2; 

  let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

  if (isAdjacent) {
    let currImg = currTile.src;
    let otherImg = otherTile.src;

    currTile.src = otherImg;
    otherTile.src = currImg;

    let validate = checkValidate();

    if (!validate) {
      currTile.src = currImg;
      otherTile.src = otherImg;
    } else {
      score += 30;
      crushSound.play();
    }
  }

  if (winning()) {
    return;
  }

  if (loosing()) {
    return;
  }
}

function crushCandy() {
  crushThree();
  slideCandy();
  generateCandy();
  document.getElementById("score").innerText = score;
}

function crushThree() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];

      if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
      }
    }
  }

  for (let r = 0; r < rows - 2; r++) {
    for (let c = 0; c < columns; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];

      if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
      }
    }
  }
}

function checkValidate() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];

      if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
        return true;
      }
    }
  }

  for (let r = 0; r < rows - 2; r++) {
    for (let c = 0; c < columns; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];

      if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
        return true;
      }
    }
  }
  return false;
}

function slideCandy() {
  for (let c = 0; c < columns; c++) {
    let ind = rows - 1;
    for (let r = rows - 1; r >= 0; r--) {
      if (!board[r][c].src.includes("blank")) {
        board[ind][c].src = board[r][c].src;
        ind--;
      }
    }
    for (let r = ind; r >= 0; r--) {
      board[r][c].src = "./images/blank.png";
    }
  }
}

function generateCandy() {
  for (let c = 0; c < columns; c++) {
    if (board[0][c].src.includes("blank")) {
      board[0][c].src = "./images/" + randomCandy() + ".png";
    }
  }
}


// Prevent further user actions after game ends
function disableUserActions() {
  // Disable any draggable or interactive elements
  // Example: Disable dragging (assuming you have draggable elements)
  let draggableElements = document.querySelectorAll('.draggable');
  draggableElements.forEach((element) => {
    element.setAttribute("draggable", "false");  // Disable drag
    element.removeEventListener("dragstart", dragStart);  // Remove event listeners
  });
  
  // Disable any buttons or other clickable elements
  let clickableElements = document.querySelectorAll('.clickable');
  clickableElements.forEach((element) => {
    element.disabled = true;  // Disable button or interaction
  });
}

// Call disableUserActions when the game ends (win or lose)
function endGame() {
  gameOver = true;  // Flag the game as over
  disableUserActions();  // Disable user actions
}