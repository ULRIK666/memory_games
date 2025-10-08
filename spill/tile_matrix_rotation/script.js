document.addEventListener('DOMContentLoaded', function () {
    const gameState = {
        level: 1,
        score: 0,
        lives: 3,
        maxLives: 3,
        isPlaying: false,
        currentTiles: [],
        highlightedTiles: [],
        boardSize: 3,
        maxBoardSize: 8,
        rotationDirection: null,
        displayTime: 2000,
        currentPhase: 'waiting',
        attempts: 0,
        maxAttempts: 3,
        currentRotation: 0 // 🔹 holder styr på hvor mange grader brettet faktisk står på
    };

    const gameBoard = document.getElementById('game-board');
    const levelDisplay = document.getElementById('level');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const rotationIndicator = document.getElementById('rotation-indicator');

    // -----------------------------------------------------

    function initGame() {
        createBoard();
        updateUI();
        startBtn.addEventListener('click', startGame);
        resetBtn.addEventListener('click', resetGame);
    }

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
        gameBoard.style.transform = `rotate(${gameState.currentRotation}deg)`;
    }

    function startGame() {
        if (gameState.isPlaying) return;

        gameState.isPlaying = true;
        startBtn.disabled = true;
        resetBtn.disabled = false;

        gameState.level = 1;
        gameState.score = 0;
        gameState.lives = gameState.maxLives;
        gameState.boardSize = 3;
        gameState.currentRotation = 0;

        updateUI();
        createBoard();
        startRound();
    }

    function resetGame() {
        gameState.level = 1;
        gameState.score = 0;
        gameState.lives = gameState.maxLives;
        gameState.boardSize = 3;
        gameState.isPlaying = false;
        gameState.currentRotation = 0;

        startBtn.disabled = false;
        resetBtn.disabled = true;

        createBoard();
        updateUI();
        rotationIndicator.textContent = '';
        resetAllTiles();
    }

    function resetAllTiles() {
        gameState.currentTiles.forEach(tile => (tile.className = 'tile'));
    }

    function nextLevel() {
        gameState.level++;
        updateUI();
        if (gameState.level % 2 === 1 && gameState.boardSize < gameState.maxBoardSize) {
            gameState.boardSize++;
        }
        gameState.displayTime = Math.max(1000, 2000 - gameState.level * 50);
        createBoard();
        startRound();
    }

    function startRound() {
        gameState.highlightedTiles = [];
        gameState.attempts = 0;
        gameState.rotationDirection = Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';

        const baseTiles = 3;
        const additionalTiles = Math.floor((gameState.level - 1) / 2);
        const size = gameState.boardSize;
        const tilesToHighlight = Math.min(baseTiles + additionalTiles, size * size);

        const allIndices = Array.from({ length: size * size }, (_, i) => i);
        for (let i = 0; i < tilesToHighlight; i++) {
            const randomIndex = Math.floor(Math.random() * allIndices.length);
            gameState.highlightedTiles.push(allIndices[randomIndex]);
            allIndices.splice(randomIndex, 1);
        }

        displayTiles();
    }

    function displayTiles() {
        gameState.currentPhase = 'display';
        rotationIndicator.textContent = 'Husk de opplyste rutene!';

        gameState.highlightedTiles.forEach(i => gameState.currentTiles[i].classList.add('highlighted'));

        setTimeout(() => {
            hideTiles();
            rotateBoardOnce(); // 🔹 roter kun én gang
        }, gameState.displayTime);
    }

    function hideTiles() {
        gameState.currentTiles.forEach(tile => tile.classList.remove('highlighted'));
    }

    // -----------------------------------------------------
    // ✅ Rotasjon bare én gang, 90 grader med animasjon
    // -----------------------------------------------------
    function rotateBoardOnce() {
        gameState.currentPhase = 'rotation';

        const direction = gameState.rotationDirection;
        rotationIndicator.textContent = `Brettet roterer ${direction === 'clockwise' ? 'med' : 'mot'} klokken`;

        // Beregn ny rotasjonsvinkel
        const delta = direction === 'clockwise' ? 90 : -90;
        gameState.currentRotation += delta;

        // Start animasjonen (CSS transition finnes allerede)
        gameBoard.style.transform = `rotate(${gameState.currentRotation}deg)`;

        // Oppdater de logiske koordinatene til rutene
        const size = gameState.boardSize;
        gameState.highlightedTiles = gameState.highlightedTiles.map(i =>
            getNewPositionAfterRotation(i, size, direction)
        );

        // Vent til animasjonen er ferdig
        setTimeout(() => {
            rotationIndicator.textContent = 'Klikk på rutene som var opplyst';
            gameState.currentPhase = 'input';
        }, 850); // samme som CSS-transition: transform 0.8s ease
    }

    // Beregn ny posisjon etter 90° rotasjon
    function getNewPositionAfterRotation(originalIndex, size, direction) {
        const row = Math.floor(originalIndex / size);
        const col = originalIndex % size;
        if (direction === 'clockwise') {
            const newRow = col;
            const newCol = size - 1 - row;
            return newRow * size + newCol;
        } else {
            const newRow = size - 1 - col;
            const newCol = row;
            return newRow * size + newCol;
        }
    }

    // -----------------------------------------------------
    // Klikklogikk
    // -----------------------------------------------------
    function handleTileClick(e) {
        if (gameState.currentPhase !== 'input' || !gameState.isPlaying) return;
        const clickedIndex = parseInt(e.target.dataset.index);

        if (gameState.highlightedTiles.includes(clickedIndex)) {
            e.target.classList.add('correct');
            gameState.highlightedTiles = gameState.highlightedTiles.filter(i => i !== clickedIndex);
            gameState.score += 10;
            updateUI();

            if (gameState.highlightedTiles.length === 0) {
                gameState.lives = gameState.maxLives;
                updateLivesDisplay();
                setTimeout(nextLevel, 800);
            }
        } else {
            e.target.classList.add('incorrect');
            gameState.attempts++;

            if (gameState.attempts >= gameState.maxAttempts) {
                gameState.lives--;
                updateLivesDisplay();

                if (gameState.lives <= 0) {
                    setTimeout(gameOver, 500);
                } else {
                    setTimeout(() => {
                        resetAllTiles();
                        startRound();
                    }, 1000);
                }
            }
            setTimeout(() => e.target.classList.remove('incorrect'), 400);
        }
    }

    // -----------------------------------------------------
    // Game over + UI-oppdatering
    // -----------------------------------------------------
    function gameOver() {
        gameState.isPlaying = false;
        rotationIndicator.textContent = `Game Over! Din poengsum: ${gameState.score}`;
        startBtn.disabled = false;
    }

    function updateUI() {
        levelDisplay.textContent = gameState.level;
        scoreDisplay.textContent = gameState.score;
        updateLivesDisplay();
    }

    function updateLivesDisplay() {
        const lifeElements = livesDisplay.querySelectorAll('.life');
        lifeElements.forEach((life, i) => {
            life.classList.toggle('active', i < gameState.lives);
        });
    }

    initGame();
});
