// Enhanced Snake Game - Modern JavaScript with SVG
class EnhancedSnakeGame {
    constructor() {
        this.svg = document.getElementById('gameSvg');
        this.scoreElement = document.getElementById('scoreValue');
        this.finalScoreElement = document.getElementById('finalScore');
        this.gameOverModal = document.getElementById('gameOverModal');
        
        // Game configuration
        this.tileCount = 20;
        this.tileSize = 400 / this.tileCount;
        this.speed = 7;
        this.score = 0;
        
        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.gameTimeoutId = null;
        
        // Snake properties
        this.headX = 10;
        this.headY = 10;
        this.snakeParts = [];
        this.tailLength = 2;
        
        // Movement
        this.inputsXVelocity = 0;
        this.inputsYVelocity = 0;
        this.xVelocity = 0;
        this.yVelocity = 0;
        
        // Food
        this.foodX = 5;
        this.foodY = 5;
        
        // SVG elements
        this.snakeGroup = null;
        this.foodElement = null;
        
        this.initializeGame();
        this.setupEventListeners();
    }
    
    initializeGame() {
        // Create SVG groups for better organization
        this.snakeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.snakeGroup.setAttribute('id', 'snake-group');
        this.svg.appendChild(this.snakeGroup);
        
        // Create initial food
        this.createFood();
        
        // Draw initial state without starting the game loop
        this.drawInitialState();
    }
    
    drawInitialState() {
        // Clear any existing snake
        this.clearSnake();
        
        // Draw initial snake (just the head)
        this.snakeParts = [{ x: this.headX, y: this.headY }];
        this.drawSnakeSegment(this.headX, this.headY, true);
        
        // Draw food
        this.drawFood();
    }
    
    setupEventListeners() {
        // Button event listeners
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.startGame());
        document.getElementById('exitBtn').addEventListener('click', () => this.exitGame());
        
        // Keyboard controls
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        
        // Touch controls for mobile
        this.setupTouchControls();
    }
    
    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.svg.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.svg.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 0 && this.inputsXVelocity !== -1) {
                    this.inputsXVelocity = 1;
                    this.inputsYVelocity = 0;
                } else if (deltaX < 0 && this.inputsXVelocity !== 1) {
                    this.inputsXVelocity = -1;
                    this.inputsYVelocity = 0;
                }
            } else {
                // Vertical swipe
                if (deltaY > 0 && this.inputsYVelocity !== -1) {
                    this.inputsYVelocity = 1;
                    this.inputsXVelocity = 0;
                } else if (deltaY < 0 && this.inputsYVelocity !== 1) {
                    this.inputsYVelocity = -1;
                    this.inputsXVelocity = 0;
                }
            }
        });
    }
    
    handleKeyDown(event) {
        if (!this.isRunning || this.isPaused) return;
        
        switch(event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (this.inputsYVelocity !== 1) {
                    this.inputsYVelocity = -1;
                    this.inputsXVelocity = 0;
                }
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (this.inputsYVelocity !== -1) {
                    this.inputsYVelocity = 1;
                    this.inputsXVelocity = 0;
                }
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (this.inputsXVelocity !== 1) {
                    this.inputsXVelocity = -1;
                    this.inputsYVelocity = 0;
                }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (this.inputsXVelocity !== -1) {
                    this.inputsXVelocity = 1;
                    this.inputsYVelocity = 0;
                }
                break;
        }
    }
    
    startGame() {
        // Clear any existing timeout
        if (this.gameTimeoutId) {
            clearTimeout(this.gameTimeoutId);
        }
        
        // Reset game state
        this.headX = 10;
        this.headY = 10;
        this.snakeParts = [];
        this.tailLength = 2;
        this.foodX = 5;
        this.foodY = 5;
        this.inputsXVelocity = 1;
        this.inputsYVelocity = 0;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.score = 0;
        this.speed = 7;
        this.isRunning = true;
        this.isPaused = false;
        
        // Update UI
        this.updateScore();
        this.gameOverModal.classList.add('hidden');
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'block';
        document.getElementById('pauseBtn').textContent = 'Pause';
        
        // Clear existing snake and food
        this.clearSnake();
        this.createFood();
        
        // Start game loop
        this.drawGame();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        
        if (!this.isPaused) {
            this.drawGame();
        } else if (this.gameTimeoutId) {
            clearTimeout(this.gameTimeoutId);
        }
    }
    
    drawGame() {
        if (this.isPaused || !this.isRunning) return;
        
        this.xVelocity = this.inputsXVelocity;
        this.yVelocity = this.inputsYVelocity;
        
        this.changeSnakePosition();
        
        if (this.isGameOver()) {
            this.gameOver();
            return;
        }
        
        this.checkFoodCollision();
        this.drawSnake();
        this.drawFood();
        
        // Increase speed based on score
        if (this.score > 5) this.speed = 9;
        if (this.score > 10) this.speed = 11;
        if (this.score > 15) this.speed = 13;
        if (this.score > 20) this.speed = 15;
        
        this.gameTimeoutId = setTimeout(() => this.drawGame(), 1000 / this.speed);
    }
    
    changeSnakePosition() {
        this.headX += this.xVelocity;
        this.headY += this.yVelocity;
    }
    
    isGameOver() {
        // Wall collision
        if (this.headX < 0 || this.headX >= this.tileCount || 
            this.headY < 0 || this.headY >= this.tileCount) {
            return true;
        }
        
        // Self collision - check against all snake parts except the last one (tail)
        for (let i = 0; i < this.snakeParts.length - 1; i++) {
            const part = this.snakeParts[i];
            if (part.x === this.headX && part.y === this.headY) {
                return true;
            }
        }
        
        return false;
    }
    
    gameOver() {
        this.isRunning = false;
        this.finalScoreElement.textContent = this.score;
        this.gameOverModal.classList.remove('hidden');
        
        if (this.gameTimeoutId) {
            clearTimeout(this.gameTimeoutId);
            this.gameTimeoutId = null;
        }
    }
    
    checkFoodCollision() {
        if (this.headX === this.foodX && this.headY === this.foodY) {
            this.tailLength++;
            this.score++;
            this.updateScore();
            this.generateNewFood();
            this.playEatAnimation();
        }
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        this.scoreElement.classList.add('animate');
        
        setTimeout(() => {
            this.scoreElement.classList.remove('animate');
        }, 600);
    }
    
    playEatAnimation() {
        // Create a temporary element for eat animation
        const eatEffect = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        eatEffect.setAttribute('cx', this.foodX * this.tileSize + this.tileSize / 2);
        eatEffect.setAttribute('cy', this.foodY * this.tileSize + this.tileSize / 2);
        eatEffect.setAttribute('r', '0');
        eatEffect.setAttribute('fill', '#ffeb3b');
        eatEffect.setAttribute('opacity', '0.8');
        
        this.svg.appendChild(eatEffect);
        
        // Animate the effect
        const animate = eatEffect.animate([
            { r: 0, opacity: 0.8 },
            { r: 15, opacity: 0 }
        ], {
            duration: 500,
            easing: 'ease-out'
        });
        
        animate.onfinish = () => {
            if (this.svg.contains(eatEffect)) {
                this.svg.removeChild(eatEffect);
            }
        };
    }
    
    generateNewFood() {
        do {
            this.foodX = Math.floor(Math.random() * this.tileCount);
            this.foodY = Math.floor(Math.random() * this.tileCount);
        } while (this.isFoodOnSnake());
        
        this.createFood();
    }
    
    isFoodOnSnake() {
        // Check if food is on snake head
        if (this.foodX === this.headX && this.foodY === this.headY) {
            return true;
        }
        
        // Check if food is on snake body
        for (let part of this.snakeParts) {
            if (part.x === this.foodX && part.y === this.foodY) {
                return true;
            }
        }
        
        return false;
    }
    
    createFood() {
        // Remove existing food
        if (this.foodElement && this.svg.contains(this.foodElement)) {
            this.svg.removeChild(this.foodElement);
        }
        
        // Create new food element
        this.foodElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.foodElement.setAttribute('cx', this.foodX * this.tileSize + this.tileSize / 2);
        this.foodElement.setAttribute('cy', this.foodY * this.tileSize + this.tileSize / 2);
        this.foodElement.setAttribute('r', this.tileSize / 2 - 2);
        this.foodElement.setAttribute('class', 'food-item');
        
        this.svg.appendChild(this.foodElement);
    }
    
    drawFood() {
        if (this.foodElement) {
            this.foodElement.setAttribute('cx', this.foodX * this.tileSize + this.tileSize / 2);
            this.foodElement.setAttribute('cy', this.foodY * this.tileSize + this.tileSize / 2);
        }
    }
    
    clearSnake() {
        // Remove all snake segments
        while (this.snakeGroup.firstChild) {
            this.snakeGroup.removeChild(this.snakeGroup.firstChild);
        }
    }
    
    drawSnake() {
        // Add new head position
        this.snakeParts.push({ x: this.headX, y: this.headY });
        
        // Remove tail if too long
        while (this.snakeParts.length > this.tailLength) {
            this.snakeParts.shift();
        }
        
        // Clear existing snake
        this.clearSnake();
        
        // Draw snake body
        for (let i = 0; i < this.snakeParts.length - 1; i++) {
            const part = this.snakeParts[i];
            this.drawSnakeSegment(part.x, part.y, false);
        }
        
        // Draw snake head
        if (this.snakeParts.length > 0) {
            const head = this.snakeParts[this.snakeParts.length - 1];
            this.drawSnakeSegment(head.x, head.y, true);
        }
    }
    
    drawSnakeSegment(x, y, isHead) {
        const segment = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        segment.setAttribute('x', x * this.tileSize + 1);
        segment.setAttribute('y', y * this.tileSize + 1);
        segment.setAttribute('width', this.tileSize - 2);
        segment.setAttribute('height', this.tileSize - 2);
        segment.setAttribute('rx', '3');
        segment.setAttribute('class', isHead ? 'snake-head' : 'snake-segment');
        
        this.snakeGroup.appendChild(segment);
    }
    
    exitGame() {
        window.location.href = '../../index.html';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedSnakeGame();
}); 