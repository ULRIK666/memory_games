<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'includes/auth.php';
require_once 'includes/scores.php';

$auth = new Auth();
$isLoggedIn = $auth->isLoggedIn();
$username = $isLoggedIn ? $_SESSION['username'] : '';

// Hent spill fra database
$scoreManager = new ScoreManager();
$games = $scoreManager->getAllGames();
?>
<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MindMatrix - Tren Hukommelsen Din</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="hexagon-background" id="hexagon-container"></div>

    <header class="header">
        <div class="nav-container">
            <a href="index.php" class="logo">MindMatrix</a>

            <button class="mobile-menu-btn" id="mobileMenuBtn">☰</button>

            <nav class="nav-menu" id="navMenu">
                <a href="index.php" class="nav-link">Hjem</a>
                <a href="statistics.php" class="nav-link">Statistikk</a>
                <a href="leaderboard.php" class="nav-link">Leaderboard</a>
                <a href="faq.php" class="nav-link">FAQ</a>
                <a href="about.php" class="nav-link">Om Oss</a>
            </nav>

            <div class="user-menu">
                <?php if($isLoggedIn): ?>
                    <div class="dropdown" id="userDropdown">
                        <div class="user-avatar" title="<?php echo htmlspecialchars($username); ?>">
                            <?php echo strtoupper(substr($username, 0, 1)); ?>
                        </div>
                        <div class="dropdown-menu">
                            <span class="dropdown-item" style="font-weight: bold; color: var(--accent-color);">
                                Hei, <?php echo htmlspecialchars($username); ?>!
                            </span>
                            <a href="profile.php" class="dropdown-item">Profil</a>
                            <a href="statistics.php" class="dropdown-item">Min Statistikk</a>
                            <div class="dropdown-divider"></div>
                            <a href="logout.php" class="dropdown-item" style="color: var(--error);">Logg ut</a>
                        </div>
                    </div>
                <?php else: ?>
                    <div class="auth-buttons">
                        <a href="login.php" class="btn btn-small btn-secondary">Logg inn</a>
                        <a href="signup.php" class="btn btn-small">Registrer deg</a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </header>

    <main class="main-container">
        <section class="welcome-section">
            <h2 class="welcome-title">
                <?php if($isLoggedIn): ?>
                    Velkommen tilbake, <?php echo htmlspecialchars($username); ?>!
                <?php else: ?>
                    Tren Hukommelsen Din
                <?php endif; ?>
            </h2>
            <p class="welcome-text">
                Utforsk vårt utvalg av kognitive spill designet for å styrke hukommelse, 
                forbedre mønstergjenkjenning og trene problemløsningsevner.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="#games" class="btn">Utforsk Spill</a>
                <?php if(!$isLoggedIn): ?>
                    <a href="signup.php" class="btn btn-secondary">Kom i gang</a>
                <?php endif; ?>
            </div>
        </section>

        <!-- Spill fra database -->
        <section id="games">
            <h2 class="section-title">Våre Kognitive Spill</h2>
            <div class="games-grid">
                <?php foreach($games as $game): ?>
                <div class="game-card" onclick="location.href='spill/<?php echo $game['slug']; ?>/index.html'">
                    <div class="game-icon">
                        <?php 
                        $icons = [
                            'memory-matrix' => '🧠',
                            'train-tracks' => '🚂',
                            'pinball-bomb' => '🎯',
                            'sequence-master' => '🎮',
                            'memory-board' => '🔍',
                            'flow-memory' => '🔄',
                            'color-blind' => '🎨',
                            'shadow-direction' => '🌓',
                            'pipe-leak' => '🔧',
                            'speed-memory' => '⚡',
                            'pattern-pro' => '🎲',
                            'logic-links' => '🧩'
                        ];
                        echo $icons[$game['slug']] ?? '🎮';
                        ?>
                    </div>
                    <h3 class="game-title"><?php echo htmlspecialchars($game['name']); ?></h3>
                    <p class="game-description"><?php echo htmlspecialchars($game['description']); ?></p>
                    <div class="game-meta">
                        <span class="game-status status-available">Spill Nå</span>
                        <span style="color: var(--text-secondary); font-size: 0.9rem;">
                            Max: <?php echo $game['max_score']; ?> poeng
                        </span>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </section>

        <?php if($isLoggedIn): ?>
        <section class="stats-section">
            <h3 class="stats-title">Dine Prestasjoner</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">12</div>
                    <div class="stat-label">Spill Spilt</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">1,247</div>
                    <div class="stat-label">Høyeste Poengsum</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">8.3</div>
                    <div class="stat-label">Gjennomsnittlig Nivå</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">3</div>
                    <div class="stat-label">Dagens Streak</div>
                </div>
            </div>
        </section>
        <?php endif; ?>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <p class="footer-text">MindMatrix - Tren din hjerne hver dag</p>
            <p class="footer-text">Utviklet for å forbedre kognitive evner gjennom morsomme og utfordrende spill</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>