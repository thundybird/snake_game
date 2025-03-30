const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

const cellSize = 10;
let score = 0;
let snake = [
  { x: 300, y: 300 },
  { x: 300, y: 310 },
  { x: 300, y: 320 },
  { x: 300, y: 330 }
];
let direction = 'UP'; // Possible values: 'UP', 'RIGHT', 'DOWN', 'LEFT'
let food = { x: 0, y: 0 };
let newFood = true;
let gameOver = false;
let gameLoopInterval;

// Draw the game on the canvas
function draw() {
  // Clear the canvas
  ctx.fillStyle = '#FFC896';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the food
  ctx.fillStyle = '#C83232';
  ctx.fillRect(food.x, food.y, cellSize, cellSize);

  // Draw the snake
  snake.forEach((segment, index) => {
    // Draw the head in red; the rest in green
    ctx.fillStyle = index === 0 ? 'red' : 'green';
    ctx.fillRect(segment.x, segment.y, cellSize, cellSize);
  });

  // Draw the score
  ctx.fillStyle = 'blue';
  ctx.font = '20px sans-serif';
  ctx.fillText('Score: ' + score, 10, 20);

  // If the game is over, display a "Game Over" message on the canvas
  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '40px sans-serif';
    ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Update the game state
function update() {
  if (gameOver) return; // Do nothing if the game is over

  // Create a new head based on the current direction
  let head = { ...snake[0] };
  if (direction === 'UP') head.y -= cellSize;
  else if (direction === 'DOWN') head.y += cellSize;
  else if (direction === 'LEFT') head.x -= cellSize;
  else if (direction === 'RIGHT') head.x += cellSize;

  // Check for collisions with walls
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    gameOver = true;
    endGame();
    return;
  }

  // Check for collisions with itself
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver = true;
      endGame();
      return;
    }
  }

  // Add the new head to the snake array
  snake.unshift(head);

  // Check if the snake has eaten the food
  if (head.x === food.x && head.y === food.y) {
    score++;
    newFood = true;
  } else {
    // Remove the last segment if no food was eaten
    snake.pop();
  }

  // Spawn new food if needed
  if (newFood) {
    spawnFood();
    newFood = false;
  }
}

// Randomly place the food on the canvas
function spawnFood() {
  food.x = Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize;
  food.y = Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize;
}

// Listen for arrow key presses to change direction
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  else if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

// The main game loop
function gameLoop() {
  update();
  draw();
}

// Start or restart the game by resetting all variables
function startGame() {
  score = 0;
  snake = [
    { x: 300, y: 300 },
    { x: 300, y: 310 },
    { x: 300, y: 320 },
    { x: 300, y: 330 }
  ];
  direction = 'UP';
  newFood = true;
  gameOver = false;
  spawnFood();
  restartButton.style.display = 'none';  // Hide the restart button

  // Clear any existing game loop interval and start a new one
  if (gameLoopInterval) clearInterval(gameLoopInterval);
  gameLoopInterval = setInterval(gameLoop, 100); // Adjust speed as needed
}

// End the game by stopping the game loop and showing the restart button
function endGame() {
  clearInterval(gameLoopInterval);
  restartButton.style.display = 'block';
}

// Add an event listener to the restart button to start a new game when clicked
restartButton.addEventListener('click', () => {
  startGame();
});

// Start the game when the page loads
startGame();
