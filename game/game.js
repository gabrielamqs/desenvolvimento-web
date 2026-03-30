// Game Configuration
const CONFIG = {
    canvasWidth: 400,
    canvasHeight: 600,
    gravity: 0.5,
    jumpForce: -9,
    pipeWidth: 70,
    pipeGap: 200,
    pipeSpeed: 3,
    pipeSpawnRate: 150,
    birdSize: 30
};

// Game State
let gameState = 'start'; // start, playing, gameOver
let score = 0;
let highScore = localStorage.getItem('flappyHighScore') || 0;

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = CONFIG.canvasWidth;
canvas.height = CONFIG.canvasHeight;

// DOM Elements
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreEl = document.getElementById('finalScore');
const finalHighScoreEl = document.getElementById('finalHighScore');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

// Bird Object
const bird = {
    x: 80,
    y: CONFIG.canvasHeight / 2,
    velocity: 0,
    rotation: 0,
    width: CONFIG.birdSize,
    height: CONFIG.birdSize,
    
    reset() {
        this.y = CONFIG.canvasHeight / 2;
        this.velocity = 0;
        this.rotation = 0;
    },
    
    jump() {
        this.velocity = CONFIG.jumpForce;
    },
    
    update() {
        this.velocity += CONFIG.gravity;
        this.y += this.velocity;
        
        // Rotation based on velocity
        this.rotation = Math.min(Math.max(this.velocity * 3, -30), 90);
        
        // Boundaries
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
        if (this.y + this.height > CONFIG.canvasHeight) {
            this.y = CONFIG.canvasHeight - this.height;
            gameOver();
        }
    },
    
    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        // Body
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Wing
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        const wingY = Math.sin(Date.now() / 50) * 3;
        ctx.ellipse(-5, wingY, 10, 6, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(8, -5, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(10, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Beak
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(22, 3);
        ctx.lineTo(12, 6);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
};

// Pipes Array
let pipes = [];

class Pipe {
    constructor() {
        this.x = CONFIG.canvasWidth;
        this.width = CONFIG.pipeWidth;
        this.gapY = Math.random() * (CONFIG.canvasHeight - CONFIG.pipeGap - 100) + 50;
        this.passed = false;
    }
    
    update() {
        this.x -= CONFIG.pipeSpeed;
    }
    
    draw() {
        // Top pipe
        this.drawPipe(this.x, 0, this.width, this.gapY, true);
        
        // Bottom pipe
        this.drawPipe(this.x, this.gapY + CONFIG.pipeGap, this.width, 
                     CONFIG.canvasHeight - this.gapY - CONFIG.pipeGap, false);
    }
    
    drawPipe(x, y, width, height, isTop) {
        // Main pipe body
        const gradient = ctx.createLinearGradient(x, 0, x + width, 0);
        gradient.addColorStop(0, '#2ECC71');
        gradient.addColorStop(0.5, '#58D68D');
        gradient.addColorStop(1, '#27AE60');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);
        
        // Pipe border
        ctx.strokeStyle = '#1E8449';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        
        // Pipe cap
        const capHeight = 30;
        const capWidth = width + 10;
        const capX = x - 5;
        const capY = isTop ? y + height - capHeight : y;
        
        const capGradient = ctx.createLinearGradient(capX, 0, capX + capWidth, 0);
        capGradient.addColorStop(0, '#27AE60');
        capGradient.addColorStop(0.5, '#58D68D');
        capGradient.addColorStop(1, '#2ECC71');
        
        ctx.fillStyle = capGradient;
        ctx.fillRect(capX, capY, capWidth, capHeight);
        ctx.strokeRect(capX, capY, capWidth, capHeight);
        
        // Highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(x + 5, y, 5, height);
        ctx.fillRect(capX + 5, capY, 5, capHeight);
    }
    
    checkCollision(bird) {
        const birdBox = {
            left: bird.x + 5,
            right: bird.x + bird.width - 5,
            top: bird.y + 5,
            bottom: bird.y + bird.height - 5
        };
        
        // Top pipe collision
        if (birdBox.right > this.x && birdBox.left < this.x + this.width) {
            if (birdBox.top < this.gapY || birdBox.bottom > this.gapY + CONFIG.pipeGap) {
                return true;
            }
        }
        
        return false;
    }
}

// Background elements
let clouds = [];
let groundOffset = 0;

function initClouds() {
    clouds = [];
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * CONFIG.canvasWidth,
            y: Math.random() * 200,
            size: 30 + Math.random() * 40,
            speed: 0.5 + Math.random() * 0.5
        });
    }
}

function drawBackground() {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, CONFIG.canvasHeight);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(0.7, '#E0F6FF');
    skyGradient.addColorStop(1, '#87CEEB');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
    
    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 0.6, cloud.y - cloud.size * 0.2, cloud.size * 0.7, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size * 1.2, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        if (gameState === 'playing') {
            cloud.x -= cloud.speed;
            if (cloud.x + cloud.size * 2 < 0) {
                cloud.x = CONFIG.canvasWidth + cloud.size;
            }
        }
    });
    
    // Ground
    const groundHeight = 80;
    const groundY = CONFIG.canvasHeight - groundHeight;
    
    // Ground gradient
    const groundGradient = ctx.createLinearGradient(0, groundY, 0, CONFIG.canvasHeight);
    groundGradient.addColorStop(0, '#8B4513');
    groundGradient.addColorStop(0.2, '#654321');
    groundGradient.addColorStop(1, '#3D2914');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, groundY, CONFIG.canvasWidth, groundHeight);
    
    // Grass
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, groundY, CONFIG.canvasWidth, 20);
    
    // Grass detail
    ctx.fillStyle = '#32CD32';
    for (let i = 0; i < CONFIG.canvasWidth; i += 20) {
        const offset = (i + groundOffset) % 40;
        ctx.beginPath();
        ctx.moveTo(i, groundY + 20);
        ctx.lineTo(i + 10, groundY);
        ctx.lineTo(i + 20, groundY + 20);
        ctx.fill();
    }
    
    if (gameState === 'playing') {
        groundOffset = (groundOffset + CONFIG.pipeSpeed) % 40;
    }
}

// Score
function updateScore() {
    scoreEl.textContent = score;
}

function checkScore(pipe) {
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
        pipe.passed = true;
        score++;
        updateScore();
    }
}

// Game Functions
function startGame() {
    gameState = 'playing';
    score = 0;
    pipes = [];
    bird.reset();
    initClouds();
    updateScore();
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
}

function gameOver() {
    gameState = 'gameOver';
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyHighScore', highScore);
    }
    
    highScoreEl.textContent = highScore;
    finalScoreEl.textContent = score;
    finalHighScoreEl.textContent = highScore;
    gameOverScreen.classList.remove('hidden');
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
    
    // Draw background
    drawBackground();
    
    if (gameState === 'playing') {
        // Update bird
        bird.update();
        
        // Spawn pipes
        if (pipes.length === 0 || 
            CONFIG.canvasWidth - pipes[pipes.length - 1].x > CONFIG.pipeSpawnRate) {
            pipes.push(new Pipe());
        }
        
        // Update and draw pipes
        pipes.forEach(pipe => {
            pipe.update();
            pipe.draw();
            checkScore(pipe);
            
            // Check collision
            if (pipe.checkCollision(bird)) {
                gameOver();
            }
        });
        
        // Remove off-screen pipes
        pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
    }
    
    // Draw bird
    bird.draw();
    
    requestAnimationFrame(gameLoop);
}

// Input Handling
function handleInput() {
    if (gameState === 'playing') {
        bird.jump();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        handleInput();
    }
});

canvas.addEventListener('click', handleInput);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleInput();
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Initialize
highScoreEl.textContent = highScore;
initClouds();
gameLoop();
