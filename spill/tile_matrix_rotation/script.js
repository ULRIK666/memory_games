document.addEventListener('DOMContentLoaded', function() {
    // Game state
    const gameState = {
        level: 1,
        score: 0,
        lives: 3,
        maxLives: 3,
        isPlaying: false,
        currentTiles: [],
        highlightedTiles: [],
        boardSize: 3, // Start with 3x3
        maxBoardSize: 8,
        rotationDirection: null,
        displayTime: 2000,
        currentPhase: 'waiting',
        attempts: 0,
        maxAttempts: 3
    };

    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const levelDisplay = document.getElementById('level');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const rotationIndicator = document.getElementById('rotation-indicator');

    // Initialize game
    function initGame() {
        createBoard();
        updateUI();
        
        startBtn.addEventListener('click', startGame);
        resetBtn.addEventListener('click', resetGame);
    }

    // Create the game board
    function createBoard() {
        gameBoard.innerHTML = '';
        
        const size = gameState.boardSize;
        gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        
        for (let i = 0; i < size * size; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.index = i;
            tile.addEventListener('click', handleTileClick);
            gameBoard.appendChild(tile);
        }
        
        gameState.currentTiles = Array.from(gameBoard.children);
        gameBoard.style.transform = 'rotate(0deg)';
    }

    // Start the game
    function startGame() {
        if (gameState.isPlaying) return;
        
        gameState.isPlaying = true;
        startBtn.disabled = true;
        resetBtn.disabled = false;
        
        gameState.level = 1;
        gameState.score = 0;
        gameState.lives = gameState.maxLives;
        gameState.boardSize = 3;
        updateUI();
        createBoard();
        startRound();
    }

    // Reset the game
    function resetGame() {
        gameState.level = 1;
        gameState.score = 0;
        gameState.lives = gameState.maxLives;
        gameState.boardSize = 3;
        gameState.isPlaying = false;
        
        startBtn.disabled = false;
        resetBtn.disabled = true;
        
        createBoard();
        updateUI();
        rotationIndicator.textContent = '';
        resetAllTiles();
    }

    // Reset all tiles to normal state
    function resetAllTiles() {
        if (gameState.currentTiles) {
            gameState.currentTiles.forEach(tile => {
                tile.className = 'tile';
            });
        }
    }

    // Proceed to next level
    function nextLevel() {
        gameState.level++;
        updateUI();
        
        // Increase board size every 2 levels, up to max
        if (gameState.level % 2 === 1 && gameState.boardSize < gameState.maxBoardSize) {
            gameState.boardSize++;
        }
        
        // Adjust display time based on level (decreases as level increases)
        gameState.displayTime = Math.max(1000, 2000 - (gameState.level * 50));
        
        createBoard();
        startRound();
    }

    // Start a new round
    function startRound() {
        gameState.highlightedTiles = [];
        gameState.attempts = 0;
        gameState.rotationDirection = Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';
        
        const baseTiles = 3;
        const additionalTiles = Math.floor((gameState.level - 1) / 2);
        const size = gameState.boardSize;
        const tilesToHighlight = Math.min(
            baseTiles + additionalTiles, 
            size * size
        );
        
        const allIndices = Array.from({length: size * size}, (_, i) => i);
        for (let i = 0; i < tilesToHighlight; i++) {
            const randomIndex = Math.floor(Math.random() * allIndices.length);
            gameState.highlightedTiles.push(allIndices[randomIndex]);
            allIndices.splice(randomIndex, 1);
        }
        
        displayTiles();
    }

    // Display the highlighted tiles
    function displayTiles() {
        gameState.currentPhase = 'display';
        rotationIndicator.textContent = 'Husk de opplyste rutene!';
        
        gameState.highlightedTiles.forEach(index => {
            gameState.currentTiles[index].classList.add('highlighted');
        });
        
        setTimeout(() => {
            hideTiles();
            rotateBoard();
        }, gameState.displayTime);
    }

    // Hide the highlighted tiles
    function hideTiles() {
        gameState.currentTiles.forEach(tile => {
            tile.classList.remove('highlighted');
        });
    }

    // Rotate the board - ONLY 90 DEGREES!
    function rotateBoard() {
        gameState.currentPhase = 'rotation';
        
        rotationIndicator.textContent = `Brettet roterer ${gameState.rotationDirection === 'clockwise' ? 'med' : 'mot'} klokken`;
        
        // Apply visual rotation - ONLY 90 DEGREES!
        const degrees = gameState.rotationDirection === 'clockwise' ? 90 : -90;
        gameBoard.style.transform = `rotate(${degrees}deg)`;
        
        setTimeout(() => {
            gameState.currentPhase = 'input';
            rotationIndicator.textContent = 'Klikk på rutene som var opplyst';
        }, 800);
    }

    // Calculate where a tile moves after 90 degree rotation
    function getNewPositionAfterRotation(originalIndex, size, direction) {
        const row = Math.floor(originalIndex / size);
        const col = originalIndex % size;
        
        if (direction === 'clockwise') {
            // Rotate 90° clockwise: (row, col) -> (col, size-1-row)
            const newRow = col;
            const newCol = size - 1 - row;
            return newRow * size + newCol;
        } else {
            // Rotate 90° counterclockwise: (row, col) -> (size-1-col, row)
            const newRow = size - 1 - col;
            const newCol = row;
            return newRow * size + newCol;
        }
    }

    // Handle tile click
    function handleTileClick(e) {
        if (gameState.currentPhase !== 'input' || !gameState.isPlaying) return;
        
        const clickedIndex = parseInt(e.target.dataset.index);
        const size = gameState.boardSize;
        
        // Calculate what the original position was BEFORE rotation
        let originalIndex;
        if (gameState.rotationDirection === 'clockwise') {
            // To reverse clockwise rotation, we rotate counterclockwise
            originalIndex = getNewPositionAfterRotation(clickedIndex, size, 'counterclockwise');
        } else {
            // To reverse counterclockwise rotation, we rotate clockwise
            originalIndex = getNewPositionAfterRotation(clickedIndex, size, 'clockwise');
        }
        
        // Check if the clicked tile was originally highlighted
        if (gameState.highlightedTiles.includes(originalIndex)) {
            // Correct selection
            e.target.classList.add('correct');
            gameState.highlightedTiles = gameState.highlightedTiles.filter(i => i !== originalIndex);
            
            gameState.score += 10;
            updateUI();
            
            if (gameState.highlightedTiles.length === 0) {
                gameState.lives = gameState.maxLives;
                updateLivesDisplay();
                
                setTimeout(() => {
                    nextLevel();
                }, 1000);
            }
        } else {
            // Incorrect selection
            e.target.classList.add('incorrect');
            gameState.attempts++;
            
            if (gameState.attempts >= gameState.maxAttempts) {
                gameState.lives--;
                updateLivesDisplay();
                
                if (gameState.lives <= 0) {
                    setTimeout(() => {
                        gameOver();
                    }, 500);
                } else {
                    setTimeout(() => {
                        resetAllTiles();
                        startRound();
                    }, 1000);
                }
            }
            
            setTimeout(() => {
                e.target.classList.remove('incorrect');
            }, 500);
        }
    }

    // Game over
    function gameOver() {
        gameState.isPlaying = false;
        rotationIndicator.textContent = `Game Over! Din poengsum: ${gameState.score}`;
        startBtn.disabled = false;
    }

    // Update UI elements
    function updateUI() {
        levelDisplay.textContent = gameState.level;
        scoreDisplay.textContent = gameState.score;
        updateLivesDisplay();
    }

    // Update lives display
    function updateLivesDisplay() {
        const lifeElements = livesDisplay.querySelectorAll('.life');
        lifeElements.forEach((life, index) => {
            if (index < gameState.lives) {
                life.classList.add('active');
            } else {
                life.classList.remove('active');
            }
        });
    }

    // Initialize the game
    initGame();
});