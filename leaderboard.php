<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'includes/auth.php';
require_once 'includes/scores.php';

$auth = new Auth();
$isLoggedIn = $auth->isLoggedIn();
$scoreManager = new ScoreManager();
?>
<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaderboard - MindMatrix</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="hexagon-background" id="hexagon-container"></div>

    <?php include 'includes/header.php'; ?>

    <main class="main-container">
        <div class="content-section">
            <div class="leaderboard-header">
                <h1 class="content-title" style="margin: 0;">Toppspillere</h1>
                <div class="leaderboard-filters">
                    <select class="filter-select" id="gameFilter">
                        <option value="all">Alle Spill</option>
                        <option value="memory-matrix">Memory Matrix</option>
                        <option value="train-tracks">Train Tracks</option>
                        <option value="pinball-bomb">Pinball Bomb</option>
                    </select>
                    <select class="filter-select" id="timeFilter">
                        <option value="all-time">All Tid</option>
                        <option value="today">I Dag</option>
                        <option value="week">Denne Uken</option>
                        <option value="month">Denne Måneden</option>
                    </select>
                </div>
            </div>

            <div class="leaderboard-container">
                <?php for($i = 1; $i <= 10; $i++): ?>
                <div class="leaderboard-item <?php echo $i <= 5 ? 'rank-' . $i : ''; ?>">
                    <div class="rank-badge"><?php echo $i; ?></div>
                    
                    <div class="user-details">
                        <div class="user-avatar-large">
                            <?php echo chr(64 + $i); ?>
                        </div>
                        <div class="user-info">
                            <div class="user-name">Spiller<?php echo $i; ?></div>
                            <div class="user-stats">
                                <span><?php echo rand(50, 500); ?> spill</span>
                                <span>•</span>
                                <span><?php echo rand(10, 100); ?>% win rate</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="score-display">
                        <div class="score-value"><?php echo number_format(rand(1000, 15000)); ?></div>
                        <div class="score-label">totale poeng</div>
                    </div>
                    
                    <div class="level-display">
                        <div class="level-value"><?php echo rand(15, 60); ?></div>
                        <div class="score-label">høyeste nivå</div>
                    </div>
                </div>
                <?php endfor; ?>
            </div>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>
    <script src="script.js"></script>
</body>
</html>