// Enhanced hexagon background with 50% more hexagons and varied opacity
function createHexagonBackground() {
    const container = document.getElementById('hexagon-container');
    if (!container) return;

    const hexCount = 38; // 50% more than 25
    
    for (let i = 0; i < hexCount; i++) {
        const hexagon = document.createElement('div');
        
        // Random size with more variety
        const sizes = ['small', 'small', 'medium', 'medium', 'large', 'xlarge'];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        hexagon.className = `hexagon ${size}`;
        
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Random animation properties
        const delay = Math.random() * 10;
        const duration = 8 + Math.random() * 8;
        
        // More varied opacity for better visual effect
        const opacity = 0.06 + Math.random() * 0.12; // Range: 0.06 to 0.18
        
        hexagon.style.left = `${left}%`;
        hexagon.style.top = `${top}%`;
        hexagon.style.animationDelay = `${delay}s`;
        hexagon.style.animationDuration = `${duration}s`;
        hexagon.style.opacity = opacity;
        
        container.appendChild(hexagon);
    }
}

// Create hexagon chart for statistics
function createHexagonChart() {
    const container = document.getElementById('hexagonChart');
    if (!container) return;

    const games = [
        { name: 'Memory Matrix', score: 85, slug: 'memory-matrix' },
        { name: 'Train Tracks', score: 92, slug: 'train-tracks' },
        { name: 'Pinball Bomb', score: 78, slug: 'pinball-bomb' },
        { name: 'Sequence Master', score: 0, slug: 'sequence-master' },
        { name: 'Memory Board', score: 65, slug: 'memory-board' },
        { name: 'Flow Memory', score: 0, slug: 'flow-memory' },
        { name: 'Color Blind', score: 88, slug: 'color-blind' },
        { name: 'Shadow Direction', score: 0, slug: 'shadow-direction' },
        { name: 'Pipe Leak', score: 71, slug: 'pipe-leak' },
        { name: 'Speed Memory', score: 0, slug: 'speed-memory' },
        { name: 'Pattern Pro', score: 95, slug: 'pattern-pro' },
        { name: 'Logic Links', score: 0, slug: 'logic-links' }
    ];

    const radius = 200;
    const centerX = 300;
    const centerY = 300;

    container.innerHTML = `
        <div class="hexagon-center">
            <div class="overall-score">76%</div>
            <div class="overall-label">Gjennomsnitt</div>
        </div>
    `;

    games.forEach((game, index) => {
        const angle = (index * 2 * Math.PI) / games.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const hexagonPoint = document.createElement('div');
        hexagonPoint.className = 'hexagon-point';
        hexagonPoint.style.left = `${x}px`;
        hexagonPoint.style.top = `${y}px`;
        hexagonPoint.setAttribute('data-game', game.slug);

        const fillHeight = game.score > 0 ? game.score : 0;

        hexagonPoint.innerHTML = `
            <div class="game-hexagon">
                <div class="score-progress" style="height: ${fillHeight}%"></div>
                <div class="game-score">${game.score > 0 ? game.score + '%' : 'Ikke spilt'}</div>
            </div>
            <div class="game-name">${game.name}</div>
        `;

        // Add click event for modal
        hexagonPoint.addEventListener('click', () => {
            showGameStatsModal(game);
        });

        container.appendChild(hexagonPoint);
    });
}

// Show game statistics modal
function showGameStatsModal(game) {
    const modal = document.getElementById('chartModal');
    const modalContent = document.querySelector('.chart-modal-content');
    
    if (!modal) {
        createStatsModal();
    }
    
    // Update modal content based on game
    document.getElementById('modalGameTitle').textContent = game.name;
    
    // Show/hide based on whether game has been played
    const noDataMessage = document.getElementById('noDataMessage');
    const chartContainer = document.getElementById('lineChartContainer');
    
    if (game.score === 0) {
        noDataMessage.style.display = 'block';
        chartContainer.style.display = 'none';
    } else {
        noDataMessage.style.display = 'none';
        chartContainer.style.display = 'block';
        createLineChart(game);
    }
    
    modal.style.display = 'block';
}

// Create statistics modal
function createStatsModal() {
    const modal = document.createElement('div');
    modal.id = 'chartModal';
    modal.className = 'chart-modal';
    
    modal.innerHTML = `
        <div class="chart-modal-content">
            <span class="close-modal">&times;</span>
            <h2 id="modalGameTitle">Game Statistics</h2>
            <div id="noDataMessage" style="text-align: center; padding: 2rem; color: var(--text-secondary); display: none;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎮</div>
                <h3>Dette spillet er ikke spilt ennå</h3>
                <p>Start med å spille for å se statistikk og forbedringer over tid!</p>
                <button class="btn" style="margin-top: 1rem;" onclick="startGame()">Start Spill</button>
            </div>
            <div id="lineChartContainer" class="line-chart-container">
                <!-- Line chart will be generated here -->
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal events
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Create line chart (simplified version)
function createLineChart(game) {
    const container = document.getElementById('lineChartContainer');
    
    // Sample data - in real app this would come from the server
    const scores = game.score > 0 ? [30, 45, 60, 52, 70, game.score] : [];
    
    container.innerHTML = `
        <div style="color: var(--text-secondary); text-align: center; margin-bottom: 1rem;">
            Prestasjonsutvikling for ${game.name}
        </div>
        <div style="display: flex; align-items: end; justify-content: center; gap: 2rem; height: 300px; border-bottom: 2px solid #444; padding-bottom: 2rem;">
            ${scores.map((score, index) => `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 40px; background: var(--accent-color); height: ${score * 2}px; border-radius: 5px; transition: all 0.3s ease; cursor: pointer;" 
                         onmouseover="this.style.transform='scale(1.1)'" 
                         onmouseout="this.style.transform='scale(1)'"
                         title="Spill ${index + 1}: ${score}%"></div>
                    <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);">${index + 1}</div>
                </div>
            `).join('')}
        </div>
        <div style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">
            ${scores.length} spill gjennomført
        </div>
    `;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createHexagonBackground();
    setupDropdowns();
    setupMobileMenu();
    
    // Create hexagon chart if on statistics page
    if (document.getElementById('hexagonChart')) {
        createHexagonChart();
    }
    
    if (typeof MindMatrixWebsite !== 'undefined') {
        new MindMatrixWebsite();
    }
});