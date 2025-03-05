// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 500;

// Load images
const birdImg = new Image();
birdImg.src = "assets/bird.png";

const pipeImg = new Image();
pipeImg.src = "assets/pipes.png";

const bgImg = new Image();
bgImg.src = "assets/background.png";

// Game variables
let bird = { 
    x: 50, 
    y: 250, 
    width: 30, 
    height: 30, 
    velocity: 0, 
    gravity: 0.4,  // Slower fall
    jump: -8       // Better control
};

let pipes = [];
let score = 0;
let gameRunning = true;

// Jump function
document.addEventListener("keydown", function (event) {
    if (event.code === "Space" && gameRunning) {
        bird.velocity = bird.jump;
    }
});

// Pipe generator
function generatePipe() {
    let gap = 100;
    let height = Math.random() * (canvas.height - 200) + 50;

    pipes.push({
        x: canvas.width,
        y: height, // Bottom pipe start
        width: 40,
        height: canvas.height - height
    });

    pipes.push({
        x: canvas.width,
        y: 0, // Top pipe start
        width: 40,
        height: height - gap
    });
}

// Restart function
function restartGame() {
    bird.y = 250;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameRunning = true;
    gameLoop();
}

// Detect Enter or R for restart
document.addEventListener("keydown", function (event) {
    if (!gameRunning && (event.code === "Enter" || event.code === "KeyR")) {
        restartGame();
    }
});

// Game loop
function update() {
    if (!gameRunning) return;

    // Bird movement
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Pipe movement
    pipes.forEach(pipe => pipe.x -= 2);

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    // Collision detection
    for (let pipe of pipes) {
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height &&
            bird.y + bird.height > pipe.y
        ) {
            gameRunning = false;
        }
    }

    // Prevent bird from going off-screen
    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
        gameRunning = false;
    }

    // Score update
    if (pipes.length > 0 && pipes[0].x + pipes[0].width === bird.x) {
        score++;
    }
}

// Draw everything with images
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Draw pipes
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImg, pipe.x, pipe.y, pipe.width, pipe.height);
    });

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    // Instructions
    if (score === 0) {
        ctx.font = "16px Arial";
        ctx.fillText("Press Spacebar to jump!", 100, 50);
    }

    if (!gameRunning) {
        ctx.fillText("Game Over! Press Enter or R to Restart", 50, 250);
    }
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Generate pipes at intervals
setInterval(generatePipe, 2000);
gameLoop();
