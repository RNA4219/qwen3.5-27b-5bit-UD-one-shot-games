// JavaScript: index.js
// HTML5 Canvas Breakout Game Implementation

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const PADDLE_SPEED = 7;
const BALL_RADIUS = 8;
const BALL_SPEED = 5;
const BRICK_ROW_COUNT = 5;
const BRICK_COLUMN_COUNT = 9;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 50;
const BRICK_OFFSET_LEFT = 35;
const BRICK_WIDTH = (CANVAS_WIDTH - (2 * BRICK_OFFSET_LEFT) - ((BRICK_COLUMN_COUNT - 1) * BRICK_PADDING)) / BRICK_COLUMN_COUNT;
const BRICK_HEIGHT = 20;

let canvas;
let ctx;
let score = 0;
let animationId;

let paddle;
let ball;
let bricks = [];

let rightPressed = false;
let leftPressed = false;

function init() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("Canvas element not found. Ensure an element with id='gameCanvas' exists in HTML.");
        return;
    }

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("Could not get 2D context");
        return;
    }

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    paddle = {
        x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
        y: CANVAS_HEIGHT - PADDLE_HEIGHT - 10,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        color: '#0095DD',
        speed: PADDLE_SPEED
    };

    ball = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT - 30,
        width: BALL_RADIUS * 2,
        height: BALL_RADIUS * 2,
        color: '#0095DD',
        dx: BALL_SPEED,
        dy: -BALL_SPEED,
        radius: BALL_RADIUS,
        active: false
    };

    bricks = [];
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        bricks[c] = [];
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
            const brickX = (c * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
            const brickY = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
            bricks[c][r] = {
                x: brickX,
                y: brickY,
                width: BRICK_WIDTH,
                height: BRICK_HEIGHT,
                color: `hsl(${c * 40}, 70%, 50%)`,
                status: 1
            };
        }
    }

    requestAnimationFrame(draw);
}

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        if (!ball.active) {
            ball.active = true;
        }
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function collisionDetection() {
    let activeBricksCount = 0;
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                activeBricksCount++;

                const ballLeft = ball.x - ball.radius;
                const ballRight = ball.x + ball.radius;
                const ballTop = ball.y - ball.radius;
                const ballBottom = ball.y + ball.radius;

                const brickLeft = b.x;
                const brickRight = b.x + b.width;
                const brickTop = b.y;
                const brickBottom = b.y + b.height;

                if (
                    ballRight > brickLeft &&
                    ballLeft < brickRight &&
                    ballBottom > brickTop &&
                    ballTop < brickBottom
                ) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score++;

                    if (activeBricksCount === 1) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function update() {
    if (rightPressed && paddle.x < CANVAS_WIDTH - paddle.width) {
        paddle.x += paddle.speed;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }

    if (ball.active) {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x + ball.radius > CANVAS_WIDTH || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
        }

        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
        }

        if (
            ball.y + ball.radius >= paddle.y &&
            ball.y - ball.radius <= paddle.y + paddle.height &&
            ball.x >= paddle.x &&
            ball.x <= paddle.x + paddle.width
        ) {
            ball.dy = -Math.abs(ball.dy);

            const hitPoint = ball.x - (paddle.x + paddle.width / 2);
            ball.dx = hitPoint * 0.15;

            const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
            if (speed > BALL_SPEED * 1.5) {
                ball.dx = (ball.dx / speed) * BALL_SPEED * 1.5;
                ball.dy = (ball.dy / speed) * BALL_SPEED * 1.5;
            }
        }

        if (ball.y + ball.radius > CANVAS_HEIGHT) {
            ball.active = false;
            ball.x = CANVAS_WIDTH / 2;
            ball.y = CANVAS_HEIGHT - 30;
            ball.dx = BALL_SPEED;
            ball.dy = -BALL_SPEED;
        }

        collisionDetection();
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = bricks[c][r].x;
                const brickY = bricks[c][r].y;
                ctx.beginPath();
                ctx.rect(brickX, brickY, bricks[c][r].width, bricks[c][r].height);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();

    update();

    animationId = requestAnimationFrame(draw);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}