const GAME_SPEED = 100;
const CANVAS_BORDER_COLOUR = '#00ffff';
const CANVAS_BACKGROUND_COLOUR = '#0d0d0d';
const SNAKE_COLOUR = '#00ffff';
const SNAKE_BORDER_COLOUR = '#001f1f';
const FOOD_COLOUR = '#ff00ff';
const FOOD_BORDER_COLOUR = '#330033';

const walls = [
    // Outer border walls
    ...Array.from({length: 30}, (_, i) => ({x: i * 10, y: 0})),
    ...Array.from({length: 30}, (_, i) => ({x: i * 10, y: 290})),
    ...Array.from({length: 28}, (_, i) => ({x: 0, y: (i + 1) * 10})),
    ...Array.from({length: 28}, (_, i) => ({x: 290, y: (i + 1) * 10})),

   // Inner maze walls
    {x: 40, y: 40}, {x: 50, y: 40}, {x: 60, y: 40}, {x: 70, y: 40}, {x: 80, y: 40},
    {x: 80, y: 50}, {x: 80, y: 60}, {x: 80, y: 70}, {x: 80, y: 80},
    {x: 90, y: 80}, {x: 100, y: 80}, {x: 110, y: 80}, {x: 120, y: 80},
    
    {x: 180, y: 100}, {x: 190, y: 100}, {x: 200, y: 100}, {x: 210, y: 100}, {x: 220, y: 100},
    {x: 180, y: 110}, {x: 180, y: 120}, {x: 180, y: 130}, {x: 180, y: 140},
    
    {x: 60, y: 170}, {x: 70, y: 170}, {x: 80, y: 170}, {x:90, y: 170}, {x: 100, y: 170},
    {x: 60, y: 180}, {x: 60, y: 190}, {x: 60, y: 200}, {x:60, y: 210}, {x: 60, y: 220},
    {x: 70, y: 220}, {x: 80, y: 220}, {x: 90, y: 220}, {x:100, y: 220}, {x: 100, y: 220},

    {x: 170, y: 220}, {x: 180, y: 220}, {x: 190, y: 220}, {x:200, y: 220}, {x: 210, y: 220},
];

let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150}
]
let score = 0;
let changingDirection = false;
let foodX;
let foodY;
let dx = 10;
let dy = 0;

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startBtn").addEventListener("click", startGame);
});

document.addEventListener("keydown", changeDirection);

function main() {
    if (didGameEnd()) return;

    setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        drawWalls();
        advanceSnake();
        drawSnake();
        
        main();
    }, GAME_SPEED)
}

function startGame(){
    document.getElementById("gameStartOverlay").classList.remove("show");
    console.log("start game");
    createFood();
    main();
}

function clearCanvas() {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.strokestyle = CANVAS_BORDER_COLOUR;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function restartGame() {
    score = 0;
    document.getElementById('score').innerHTML = score;
    dx = 10;
    dy = 0;
    snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150},
        {x: 110, y: 150}
    ];
    changingDirection = false;
    document.getElementById("gameOverOverlay").classList.remove("show");
    createFood();
    main();
}

function drawWalls() {
    ctx.fillStyle = 'gray';
    ctx.strokeStyle = 'black';
    walls.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, 10, 10);
        ctx.strokeRect(wall.x, wall.y, 10, 10);
    });
}

function drawFood() {
    ctx.fillStyle = FOOD_COLOUR;
    ctx.strokeStyle = FOOD_BORDER_COLOUR;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        document.getElementById('score').innerHTML = score;
        createFood();
    } else {
        snake.pop();
    }
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            showGameOver();
            return true;
        }
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    const hitMazeWall = walls.some(wall => wall.x === snake[0].x && wall.y === snake[0].y);

    if(hitLeftWall || hitRightWall || hitToptWall || hitBottomWall || hitMazeWall){
        showGameOver();
        return true;
    }
    return false;
}

function showGameOver() {
    document.getElementById("finalScore").innerText = score;
    document.getElementById("restartBtn").addEventListener("click", restartGame);
    document.getElementById("gameOverOverlay").classList.add("show");
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);
    
    const isOnSnake = snake.some(part => part.x === foodX && part.y === foodY);
    const isOnWall = walls.some(wall => wall.x === foodX && wall.y === foodY);

    if (isOnSnake || isOnWall) {
        createFood();
    }
}

function drawSnake() {
    snake.forEach(drawSnakePart)
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = SNAKE_COLOUR;
    ctx.strokeStyle = SNAKE_BORDER_COLOUR;
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;

    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}