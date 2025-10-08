class MemoryTileGame {
    constructor() {
        this.level = 1;
        this.lives = 3;
        this.attempts = 3;
        this.gridSize = 3;
        this.activeTiles = [];
        this.originalActiveTiles = []; // Lagrer de originale posisjonene
        this.rotationDirection = null;
        this.isShowingTiles = false;
        this.isGameActive = false;
        this.gridContainer = document.getElementById('grid-container');
        this.messageElement = document.getElementById('message');
        this.startButton = document.getElementById('start-btn');
        this.levelElement = document.getElementById('level');
        this.livesElement = document.getElementById('lives');
        this.attemptsElement = document.getElementById('attempts');
        this.rotationDirectionElement = document.getElementById('rotation-direction');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.startButton.addEventListener('click', () => {
            if (!this.isGameActive) {
                this.startGame();
            } else {
                this.startGame(); // Restart
            }
        });
    }
    
    startGame() {
        this.level = 1;
        this.lives = 3;
        this.attempts = 3;
        this.gridSize = 3;
        this.isGameActive = true;
        this.startButton.textContent = "Restart Spill";
        this.updateStats();
        this.nextLevel();
    }
    
    nextLevel() {
        this.messageElement.textContent = "Forbereder nytt nivå...";
        this.activeTiles = [];
        this.originalActiveTiles = [];
        this.attempts = 3;
        this.updateStats();
        
        // Calculate number of tiles to light up (starts with 3 and increases with level)
        const tilesToLight = Math.min(3 + Math.floor(this.level / 2), this.gridSize * this.gridSize);
        
        // Generate random active tiles
        while (this.activeTiles.length < tilesToLight) {
            const randomTile = Math.floor(Math.random() * this.gridSize * this.gridSize);
            if (!this.activeTiles.includes(randomTile)) {
                this.activeTiles.push(randomTile);
            }
        }
        
        // Create grid
        this.createGrid();
        
        // Show tiles to memorize
        this.showTilesToMemorize();
    }
    
    createGrid() {
        this.gridContainer.innerHTML = '';
        this.gridContainer.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        this.gridContainer.style.transform = 'rotate(0deg)'; // Reset rotation
        
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.index = i;
            tile.addEventListener('click', () => this.handleTileClick(i));
            this.gridContainer.appendChild(tile);
        }
    }
    
    showTilesToMemorize() {
        this.isShowingTiles = true;
        this.messageElement.textContent = "Husk disse rutene!";
        
        // Show active tiles
        this.activeTiles.forEach(index => {
            const tile = this.gridContainer.querySelector(`[data-index="${index}"]`);
            tile.classList.add('active');
        });
        
        // Calculate display time (decreases as level increases)
        const displayTime = Math.max(1500, 3000 - (this.level * 100));
        
        // Hide tiles after display time
        setTimeout(() => {
            this.activeTiles.forEach(index => {
                const tile = this.gridContainer.querySelector(`[data-index="${index}"]`);
                tile.classList.remove('active');
            });
            
            this.isShowingTiles = false;
            this.rotateGrid();
        }, displayTime);
    }
    
    rotateGrid() {
        // Lagre de originale posisjonene før rotasjon
        this.originalActiveTiles = [...this.activeTiles];
        
        // Randomly choose rotation direction
        this.rotationDirection = Math.random() < 0.5 ? 'clockwise' : 'counterclockwise';
        this.rotationDirectionElement.textContent = this.rotationDirection === 'clockwise' ? 'Med klokken' : 'Mot klokken';
        
        this.messageElement.textContent = "Rutenettet roterer! Husk de nye posisjonene.";
        
        // Apply rotation animation
        this.gridContainer.style.transition = 'transform 0.5s ease-in-out';
        
        if (this.rotationDirection === 'clockwise') {
            this.gridContainer.style.transform = 'rotate(90deg)';
        } else {
            this.gridContainer.style.transform = 'rotate(-90deg)';
        }
        
        // Beregn de nye posisjonene etter rotasjon
        this.activeTiles = this.calculateRotatedTiles(this.originalActiveTiles);
        
        // Remove transition after animation and reset grid for next level
        setTimeout(() => {
            this.gridContainer.style.transition = 'none';
            this.messageElement.textContent = "Klikk på rutene som var opplyst!";
        }, 500);
    }
    
    calculateRotatedTiles(originalTiles) {
        const rotatedTiles = [];
        const size = this.gridSize;
        
        originalTiles.forEach(tileIndex => {
            const row = Math.floor(tileIndex / size);
            const col = tileIndex % size;
            
            let newRow, newCol;
            
            if (this.rotationDirection === 'clockwise') {
                // Rotate 90 degrees clockwise: (row, col) -> (col, size-1-row)
                newRow = col;
                newCol = size - 1 - row;
            } else {
                // Rotate 90 degrees counterclockwise: (row, col) -> (size-1-col, row)
                newRow = size - 1 - col;
                newCol = row;
            }
            
            const newIndex = newRow * size + newCol;
            rotatedTiles.push(newIndex);
        });
        
        return rotatedTiles;
    }
    
    handleTileClick(index) {
        if (this.isShowingTiles || !this.isGameActive) return;
        
        const tile = this.gridContainer.querySelector(`[data-index="${index}"]`);
        
        // Sjekk om den klikkede ruten er en av de aktive rutene etter rotasjon
        if (this.activeTiles.includes(index)) {
            // Correct tile
            tile.classList.add('correct');
            this.activeTiles = this.activeTiles.filter(tileIndex => tileIndex !== index);
            
            if (this.activeTiles.length === 0) {
                // All correct tiles have been clicked
                this.messageElement.textContent = "Riktig! Neste nivå...";
                this.level++;
                this.updateStats();
                
                // Increase grid size every 2 levels
                if (this.level % 2 === 1 && this.gridSize < 8) {
                    this.gridSize++;
                }
                
                setTimeout(() => {
                    this.resetTiles();
                    this.gridContainer.style.transform = 'rotate(0deg)'; // Reset rotation
                    this.nextLevel();
                }, 1500);
            }
        } else {
            // Incorrect tile
            tile.classList.add('incorrect');
            this.attempts--;
            this.updateStats();
            
            if (this.attempts <= 0) {
                this.lives--;
                this.updateStats();
                
                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    this.messageElement.textContent = "Du mistet et liv. Prøv på nytt!";
                    setTimeout(() => {
                        this.resetTiles();
                        this.gridContainer.style.transform = 'rotate(0deg)'; // Reset rotation
                        this.nextLevel();
                    }, 1500);
                }
            } else {
                this.messageElement.textContent = `Feil! Du har ${this.attempts} forsøk igjen.`;
                setTimeout(() => {
                    tile.classList.remove('incorrect');
                }, 1000);
            }
        }
    }
    
    resetTiles() {
        const tiles = this.gridContainer.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.classList.remove('correct', 'incorrect');
        });
    }
    
    updateStats() {
        this.levelElement.textContent = this.level;
        this.livesElement.textContent = this.lives;
        this.attemptsElement.textContent = this.attempts;
    }
    
    gameOver() {
        this.isGameActive = false;
        this.messageElement.textContent = `Game Over! Du nådde nivå ${this.level}.`;
        this.startButton.textContent = "Start Spill På Nytt";
        this.resetTiles();
        this.gridContainer.style.transform = 'rotate(0deg)'; // Reset rotation
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryTileGame();
});