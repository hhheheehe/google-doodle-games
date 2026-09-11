// Create starfield background
function createStarfield() {
    const starsContainer = document.querySelector('.stars');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

// Screen Navigation
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.classList.contains('active')) {
            screen.classList.add('hidden-left');
            screen.classList.remove('active');
        }
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    setTimeout(() => {
        targetScreen.classList.remove('hidden-left');
        targetScreen.classList.add('active');
    }, 50);

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

function showHome() {
    showScreen('home');
    event.preventDefault();
}

function showGames() {
    showScreen('games');
    event.preventDefault();
}

function showAbout() {
    showScreen('about');
    event.preventDefault();
}

// Game Loading
function loadGame(gameType) {
    const gameContainer = document.getElementById('gameContainer');
    const gameContent = document.getElementById('gameContent');
    const gameTitle = document.getElementById('gameTitle');

    gameContent.innerHTML = '';

    switch(gameType) {
        case 'dino':
            gameTitle.textContent = 'Chrome Dinosaur Game';
            loadDinoGame(gameContent);
            break;
        case 'pacman':
            gameTitle.textContent = 'PAC-MAN';
            loadPacmanGame(gameContent);
            break;
        case 'snake':
            gameTitle.textContent = 'Snake Game';
            loadSnakeGame(gameContent);
            break;
        case 'flappy':
            gameTitle.textContent = 'Flappy Bird';
            loadFlappyGame(gameContent);
            break;
    }

    gameContainer.classList.add('active');
}

function closeGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.classList.remove('active');
}

// Dinosaur Game
function loadDinoGame(container) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth - 40;
    canvas.height = 400;
    canvas.style.border = '2px solid #333';
    canvas.style.borderRadius = '10px';
    canvas.style.background = '#fff';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const game = {
        dino: { x: 50, y: 250, width: 40, height: 40, velocityY: 0, jumping: false },
        cactus: { x: canvas.width, y: 270, width: 25, height: 50 },
        gameSpeed: 6,
        gameRunning: true,
        score: 0
    };

    const gravity = 0.6;
    const jumpStrength = 12;

    function drawDino() {
        ctx.fillStyle = '#333';
        ctx.fillRect(game.dino.x, game.dino.y, game.dino.width, game.dino.height);
        // Draw eye
        ctx.fillStyle = '#fff';
        ctx.fillRect(game.dino.x + 25, game.dino.y + 10, 8, 8);
    }

    function drawCactus() {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(game.cactus.x, game.cactus.y, game.cactus.width, game.cactus.height);
    }

    function drawGround() {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 300);
        ctx.lineTo(canvas.width, 300);
        ctx.stroke();
    }

    function updateGame() {
        if (!game.gameRunning) return;

        // Update dino
        if (game.dino.jumping) {
            game.dino.velocityY += gravity;
            game.dino.y += game.dino.velocityY;

            if (game.dino.y + game.dino.height >= 300) {
                game.dino.y = 300 - game.dino.height;
                game.dino.jumping = false;
                game.dino.velocityY = 0;
            }
        }

        // Update cactus
        game.cactus.x -= game.gameSpeed;
        if (game.cactus.x < -game.cactus.width) {
            game.cactus.x = canvas.width;
            game.score += 10;
            game.gameSpeed += 0.5;
        }

        // Collision detection
        if (
            game.dino.x < game.cactus.x + game.cactus.width &&
            game.dino.x + game.dino.width > game.cactus.x &&
            game.dino.y + game.dino.height > game.cactus.y
        ) {
            game.gameRunning = false;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw everything
        drawGround();
        drawDino();
        drawCactus();

        // Draw score
        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Score: ' + game.score, 10, 30);

        if (!game.gameRunning) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText('Final Score: ' + game.score, canvas.width / 2, canvas.height / 2 + 50);
        }

        requestAnimationFrame(updateGame);
    }

    // Controls
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'ArrowUp') {
            if (!game.dino.jumping && game.gameRunning) {
                game.dino.jumping = true;
                game.dino.velocityY = -jumpStrength;
            }
            e.preventDefault();
        }
    });

    canvas.addEventListener('click', () => {
        if (!game.dino.jumping && game.gameRunning) {
            game.dino.jumping = true;
            game.dino.velocityY = -jumpStrength;
        }
    });

    updateGame();
}

// Pacman Game
function loadPacmanGame(container) {
    const gameDiv = document.createElement('div');
    gameDiv.style.cssText = `
        width: 400px;
        height: 400px;
        background: #000;
        border: 3px solid #FFD700;
        border-radius: 10px;
        position: relative;
        overflow: hidden;
    `;

    const pacman = document.createElement('div');
    pacman.style.cssText = `
        width: 30px;
        height: 30px;
        background: #FFD700;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%);
        animation: pacman-move 3s infinite;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes pacman-move {
            0% { left: 50px; }
            50% { left: 350px; }
            100% { left: 50px; }
        }
        @keyframes ghost-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
    `;
    gameDiv.appendChild(style);

    // Add score
    const score = document.createElement('div');
    score.style.cssText = `
        color: #FFD700;
        font-size: 18px;
        margin-bottom: 10px;
        text-align: center;
        font-weight: bold;
    `;
    score.textContent = 'Score: 0 | Get the yellow pellets!';

    // Add ghosts
    for (let i = 0; i < 3; i++) {
        const ghost = document.createElement('div');
        ghost.style.cssText = `
            width: 25px;
            height: 25px;
            background: ${['#FF0000', '#FF69B4', '#00FFFF'][i]};
            border-radius: 5px 5px 0 0;
            position: absolute;
            left: ${100 + i * 80}px;
            top: ${50 + Math.sin(i) * 30}px;
            animation: ghost-float 2s ease-in-out infinite;
            animation-delay: ${i * 0.3}s;
        `;
        gameDiv.appendChild(ghost);
    }

    gameDiv.appendChild(pacman);
    container.appendChild(score);
    container.appendChild(gameDiv);
}

// Snake Game
function loadSnakeGame(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    canvas.style.border = '2px solid #333';
    canvas.style.borderRadius = '10px';
    canvas.style.background = '#1a1a1a';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const gridSize = 20;

    const game = {
        snake: [{ x: 200, y: 200 }],
        food: { x: 300, y: 300 },
        direction: { x: 1, y: 0 },
        nextDirection: { x: 1, y: 0 },
        score: 0,
        gameRunning: true
    };

    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = '#4CAF50';
        game.snake.forEach(segment => {
            ctx.fillRect(segment.x - gridSize / 2, segment.y - gridSize / 2, gridSize - 2, gridSize - 2);
        });

        // Draw food
        ctx.fillStyle = '#FF5252';
        ctx.fillRect(game.food.x - gridSize / 2, game.food.y - gridSize / 2, gridSize - 2, gridSize - 2);

        // Draw score
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Score: ' + game.score, 10, 30);
    }

    function updateGame() {
        if (!game.gameRunning) {
            drawGameOver();
            return;
        }

        game.direction = game.nextDirection;

        const head = { x: game.snake[0].x + game.direction.x * gridSize, y: game.snake[0].y + game.direction.y * gridSize };

        // Wall collision
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            game.gameRunning = false;
        }

        // Self collision
        for (let segment of game.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                game.gameRunning = false;
            }
        }

        game.snake.unshift(head);

        // Food collision
        if (head.x === game.food.x && head.y === game.food.y) {
            game.score += 10;
            game.food = { x: Math.round(Math.random() * (canvas.width / gridSize)) * gridSize, y: Math.round(Math.random() * (canvas.height / gridSize)) * gridSize };
        } else {
            game.snake.pop();
        }

        drawGame();
        requestAnimationFrame(updateGame);
    }

    function drawGameOver() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + game.score, canvas.width / 2, canvas.height / 2 + 50);
    }

    // Controls
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                if (game.direction.y === 0) game.nextDirection = { x: 0, y: -1 };
                e.preventDefault();
                break;
            case 'ArrowDown':
                if (game.direction.y === 0) game.nextDirection = { x: 0, y: 1 };
                e.preventDefault();
                break;
            case 'ArrowLeft':
                if (game.direction.x === 0) game.nextDirection = { x: -1, y: 0 };
                e.preventDefault();
                break;
            case 'ArrowRight':
                if (game.direction.x === 0) game.nextDirection = { x: 1, y: 0 };
                e.preventDefault();
                break;
        }
    });

    updateGame();
}

// Flappy Bird Game
function loadFlappyGame(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    canvas.style.border = '2px solid #333';
    canvas.style.borderRadius = '10px';
    canvas.style.background = 'linear-gradient(180deg, #87CEEB, #E0F6FF)';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const game = {
        bird: { x: 50, y: canvas.height / 2, size: 20, velocityY: 0 },
        pipes: [],
        score: 0,
        gameRunning: true,
        gap: 120,
        pipeWidth: 60,
        pipeSpeed: 4
    };

    const gravity = 0.5;
    const jumpPower = 10;

    function drawBird() {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(game.bird.x, game.bird.y, game.bird.size, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(game.bird.x + 8, game.bird.y - 5, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawPipes() {
        ctx.fillStyle = '#4CAF50';
        game.pipes.forEach(pipe => {
            // Top pipe
            ctx.fillRect(pipe.x, 0, game.pipeWidth, pipe.topHeight);
            // Bottom pipe
            ctx.fillRect(pipe.x, pipe.topHeight + game.gap, game.pipeWidth, canvas.height - (pipe.topHeight + game.gap));
        });
    }

    function updateGame() {
        if (!game.gameRunning) {
            drawGameOver();
            return;
        }

        // Update bird
        game.bird.velocityY += gravity;
        game.bird.y += game.bird.velocityY;

        // Game over conditions
        if (game.bird.y - game.bird.size < 0 || game.bird.y + game.bird.size > canvas.height) {
            game.gameRunning = false;
        }

        // Update pipes
        game.pipes.forEach((pipe, index) => {
            pipe.x -= game.pipeSpeed;

            // Collision detection
            if (
                game.bird.x + game.bird.size > pipe.x &&
                game.bird.x - game.bird.size < pipe.x + game.pipeWidth
            ) {
                if (game.bird.y - game.bird.size < pipe.topHeight || game.bird.y + game.bird.size > pipe.topHeight + game.gap) {
                    game.gameRunning = false;
                }
            }

            // Score and remove pipe
            if (pipe.x + game.pipeWidth < 0) {
                game.pipes.splice(index, 1);
                game.score++;
            }
        });

        // Add new pipe
        if (game.pipes.length === 0 || game.pipes[game.pipes.length - 1].x < canvas.width - 150) {
            const topHeight = Math.random() * (canvas.height - game.gap - 100) + 50;
            game.pipes.push({ x: canvas.width, topHeight: topHeight });
        }

        // Clear canvas and draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPipes();
        drawBird();

        // Draw score
        ctx.fillStyle = '#000';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Score: ' + game.score, 10, 40);

        requestAnimationFrame(updateGame);
    }

    function drawGameOver() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + game.score, canvas.width / 2, canvas.height / 2 + 50);
    }

    // Controls
    function jump() {
        if (game.gameRunning) {
            game.bird.velocityY = -jumpPower;
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'ArrowUp') {
            jump();
            e.preventDefault();
        }
    });

    canvas.addEventListener('click', jump);

    updateGame();
}

// Initialize
window.addEventListener('load', () => {
    createStarfield();
});
