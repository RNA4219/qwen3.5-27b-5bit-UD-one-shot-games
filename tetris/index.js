// TypeScript: index.ts
// HTML5 Canvas Tetris Implementation
// --- Constants ---
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30; // Calculated roughly, but we scale to canvas
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const BASE_DROP_INTERVAL = 1000; // ms
// Tetromino Definitions (Matrix form)
const TETROMINOS = {
    I: {
        matrix: [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ],
        color: '#00FFFF' // Cyan
    },
    O: {
        matrix: [
            [2, 2],
            [2, 2],
        ],
        color: '#FFFF00' // Yellow
    },
    T: {
        matrix: [
            [0, 3, 0],
            [3, 3, 3],
            [0, 0, 0],
        ],
        color: '#800080' // Purple
    },
    S: {
        matrix: [
            [0, 4, 4],
            [4, 4, 0],
            [0, 0, 0],
        ],
        color: '#00FF00' // Green
    },
    Z: {
        matrix: [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ],
        color: '#FF0000' // Red
    },
    J: {
        matrix: [
            [6, 0, 0],
            [6, 6, 6],
            [0, 0, 0],
        ],
        color: '#0000FF' // Blue
    },
    L: {
        matrix: [
            [0, 0, 7],
            [7, 7, 7],
            [0, 0, 0],
        ],
        color: '#FFA500' // Orange
    }
};
const TETROMINO_KEYS = Object.keys(TETROMINOS);
// --- Global Variables ---
let canvas;
let ctx;
let state;
let animationId;
// --- Initialization ---
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
    resetGame();
    document.addEventListener('keydown', handleInput, false);
    // Start Loop
    state.lastTime = performance.now();
    animationId = requestAnimationFrame(update);
}
function resetGame() {
    state = {
        grid: createGrid(),
        activePiece: null,
        score: 0,
        lines: 0,
        level: 1,
        gameOver: false,
        dropCounter: 0,
        dropInterval: BASE_DROP_INTERVAL,
        lastTime: 0
    };
    spawnPiece();
}
function createGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}
// --- Game Logic ---
function spawnPiece() {
    const type = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
    const tetromino = TETROMINOS[type];
    state.activePiece = {
        pos: { x: Math.floor(COLS / 2) - Math.floor(tetromino.matrix[0].length / 2), y: 0 },
        matrix: tetromino.matrix,
        color: tetromino.color
    };
    // Check immediate collision (Game Over)
    if (collide(state.grid, state.activePiece)) {
        state.gameOver = true;
        setTimeout(() => {
            alert(`GAME OVER\nScore: ${state.score}\nLines: ${state.lines}`);
            resetGame();
        }, 10);
    }
}
function collide(grid, piece) {
    const m = piece.matrix;
    const o = piece.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0) {
                const newX = o.x + x;
                const newY = o.y + y;
                // Check boundaries
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }
                // Check grid occupancy (ignore if above board)
                if (newY >= 0 && grid[newY][newX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}
function merge(grid, piece) {
    piece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                // Store color string in grid? No, grid is number.
                // Let's map color to a simple index or store a separate color grid.
                // To keep it simple, we will store the color string in a parallel structure or just use the color directly.
                // Since the prompt asks for simple implementation, let's store the color string in the grid directly.
                // Wait, grid was initialized as number[][]. Let's change grid type to string[][] or (string | 0)[][]
                // Re-defining grid type implicitly by usage below.
                const gridY = piece.pos.y + y;
                const gridX = piece.pos.x + x;
                if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
                    grid[gridY][gridX] = piece.color;
                }
            }
        });
    });
}
function rotate(matrix) {
    // Transpose
    const N = matrix.length;
    const result = matrix.map((row, i) => row.map((val, j) => matrix[j][i]));
    // Reverse rows
    return result.map(row => row.reverse());
}
function playerRotate() {
    if (!state.activePiece)
        return;
    const originalMatrix = state.activePiece.matrix;
    state.activePiece.matrix = rotate(state.activePiece.matrix);
    // Wall kick (basic)
    if (collide(state.grid, state.activePiece)) {
        // Try moving left/right if rotation causes collision
        const originalX = state.activePiece.pos.x;
        state.activePiece.pos.x += 1;
        if (!collide(state.grid, state.activePiece))
            return;
        state.activePiece.pos.x -= 2;
        if (!collide(state.grid, state.activePiece))
            return;
        state.activePiece.pos.x = originalX;
        // Revert rotation
        state.activePiece.matrix = originalMatrix;
    }
}
function playerMove(dir) {
    if (!state.activePiece)
        return;
    state.activePiece.pos.x += dir;
    if (collide(state.grid, state.activePiece)) {
        state.activePiece.pos.x -= dir;
    }
}
function playerDrop() {
    if (!state.activePiece)
        return;
    state.activePiece.pos.y++;
    if (collide(state.grid, state.activePiece)) {
        state.activePiece.pos.y--;
        lockPiece();
        spawnPiece();
    }
    state.dropCounter = 0;
}
function playerHardDrop() {
    if (!state.activePiece)
        return;
    while (!collide(state.grid, state.activePiece)) {
        state.activePiece.pos.y++;
    }
    state.activePiece.pos.y--;
    lockPiece();
    spawnPiece();
    state.dropCounter = 0;
}
function lockPiece() {
    if (!state.activePiece)
        return;
    merge(state.grid, state.activePiece);
    state.activePiece = null;
    arenaSweep();
}
function arenaSweep() {
    let rowCount = 0;
    outer: for (let y = ROWS - 1; y > 0; --y) {
        for (let x = 0; x < COLS; ++x) {
            if (state.grid[y][x] === 0) {
                continue outer;
            }
        }
        const row = state.grid.splice(y, 1)[0];
        state.grid.unshift(row.map(() => 0));
        ++y;
        rowCount++;
    }
    if (rowCount > 0) {
        // Scoring: 100, 300, 500, 800
        const lineScores = [0, 100, 300, 500, 800];
        state.score += lineScores[rowCount] * state.level;
        state.lines += rowCount;
        // Level up every 10 lines
        state.level = Math.floor(state.lines / 10) + 1;
        state.dropInterval = Math.max(100, BASE_DROP_INTERVAL - (state.level - 1) * 50);
    }
}
// --- Input Handling ---
function handleInput(event) {
    if (state.gameOver)
        return;
    if (event.key === 'ArrowLeft') {
        playerMove(-1);
    }
    else if (event.key === 'ArrowRight') {
        playerMove(1);
    }
    else if (event.key === 'ArrowUp') {
        playerRotate();
    }
    else if (event.key === 'ArrowDown') {
        playerDrop();
    }
}
// --- Update & Draw ---
function update(time = 0) {
    if (state.gameOver)
        return;
    const deltaTime = time - state.lastTime;
    state.lastTime = time;
    state.dropCounter += deltaTime;
    if (state.dropCounter > state.dropInterval) {
        playerDrop();
    }
    draw();
    animationId = requestAnimationFrame(update);
}
function draw() {
    // Clear Canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Center the grid
    const offsetX = (CANVAS_WIDTH - COLS * BLOCK_SIZE) / 2;
    const offsetY = (CANVAS_HEIGHT - ROWS * BLOCK_SIZE) / 2;
    // Draw Grid (Arena)
    drawGrid(offsetX, offsetY);
    // Draw Active Piece
    if (state.activePiece) {
        drawMatrix(state.activePiece.matrix, state.activePiece.pos, state.activePiece.color, offsetX, offsetY);
    }
    // Draw UI
    drawUI();
}
function drawGrid(offsetX, offsetY) {
    for (let y = 0; y < ROWS; ++y) {
        for (let x = 0; x < COLS; ++x) {
            const color = state.grid[y][x];
            if (color !== 0) {
                drawBlock(x, y, color, offsetX, offsetY);
            }
            else {
                // Draw faint grid lines
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.strokeRect(offsetX + x * BLOCK_SIZE, offsetY + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}
function drawMatrix(matrix, offset, color, offsetX, offsetY) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(offset.x + x, offset.y + y, color, offsetX, offsetY);
            }
        });
    });
}
function drawBlock(x, y, color, offsetX, offsetY) {
    ctx.fillStyle = color;
    ctx.fillRect(offsetX + x * BLOCK_SIZE + 1, offsetY + y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
    // Bevel effect
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.moveTo(offsetX + x * BLOCK_SIZE, offsetY + y * BLOCK_SIZE + BLOCK_SIZE);
    ctx.lineTo(offsetX + x * BLOCK_SIZE, offsetY + y * BLOCK_SIZE);
    ctx.lineTo(offsetX + x * BLOCK_SIZE + BLOCK_SIZE, offsetY + y * BLOCK_SIZE);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.moveTo(offsetX + x * BLOCK_SIZE + BLOCK_SIZE, offsetY + y * BLOCK_SIZE + BLOCK_SIZE);
    ctx.lineTo(offsetX + x * BLOCK_SIZE, offsetY + y * BLOCK_SIZE + BLOCK_SIZE);
    ctx.lineTo(offsetX + x * BLOCK_SIZE + BLOCK_SIZE, offsetY + y * BLOCK_SIZE);
    ctx.stroke();
}
function drawUI() {
    ctx.fillStyle = '#FFF';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    // Draw on the side or top
    const uiX = CANVAS_WIDTH - 150;
    const uiY = 50;
    ctx.fillText(`Score: ${state.score}`, uiX, uiY);
    ctx.fillText(`Lines: ${state.lines}`, uiX, uiY + 30);
    ctx.fillText(`Level: ${state.level}`, uiX, uiY + 60);
}
// --- Entry Point ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
}
else {
    init();
}
