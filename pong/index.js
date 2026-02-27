const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;

const leftPaddle = {
    x: 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

const rightPaddle = {
    x: canvas.width - PADDLE_WIDTH - 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

const ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    width: BALL_SIZE,
    height: BALL_SIZE,
    dy: BALL_SPEED
};

let ballDx = BALL_SPEED;
let scoreLeft = 0;
let scoreRight = 0;

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ballDx = -ballDx;
}

function update() {
    // Left Paddle Movement
    if (keys['w'] || keys['W']) {
        leftPaddle.y -= PADDLE_SPEED;
    }
    if (keys['s'] || keys['S']) {
        leftPaddle.y += PADDLE_SPEED;
    }

    // Right Paddle Movement
    if (keys['ArrowUp']) {
        rightPaddle.y -= PADDLE_SPEED;
    }
    if (keys['ArrowDown']) {
        rightPaddle.y += PADDLE_SPEED;
    }

    // Clamp paddles within canvas
    leftPaddle.y = Math.max(0, Math.min(canvas.height - leftPaddle.height, leftPaddle.y));
    rightPaddle.y = Math.max(0, Math.min(canvas.height - rightPaddle.height, rightPaddle.y));

    // Ball Movement
    ball.x += ballDx;
    ball.y += ball.dy;

    // Ball Wall Collision (Top/Bottom)
    if (ball.y <= 0 || ball.y + ball.height >= canvas.height) {
        ball.dy *= -1;
    }

    // Ball Paddle Collision
    if (ball.x + ball.width >= leftPaddle.x && ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.y + ball.height >= leftPaddle.y && ball.y <= leftPaddle.y + leftPaddle.height) {
        ballDx *= -1;
        ball.x = leftPaddle.x + leftPaddle.width;
    }

    if (ball.x <= rightPaddle.x + rightPaddle.width && ball.x + ball.width >= rightPaddle.x &&
        ball.y + ball.height >= rightPaddle.y && ball.y <= rightPaddle.y + rightPaddle.height) {
        ballDx *= -1;
        ball.x = rightPaddle.x - ball.width;
    }

    // Scoring
    if (ball.x < 0) {
        scoreRight++;
        resetBall();
    } else if (ball.x > canvas.width) {
        scoreLeft++;
        resetBall();
    }
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw Ball
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

    // Draw Score
    ctx.font = '20px Arial';
    ctx.fillText(`Left: ${scoreLeft} Right: ${scoreRight}`, 10, 30);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
