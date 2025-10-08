<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'includes/auth.php';
$auth = new Auth();
if (!$auth->isLoggedIn()) {
    header("Location: login.php");
    exit;
}
$username = $_SESSION['username'];
?>
<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profil - MindMatrix</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="hexagon-background" id="hexagon-container"></div>

    <?php include 'includes/header.php'; ?>

    <main class="main-container">
        <div class="content-section">
            <h1 class="content-title">Din Profil</h1>
            
            <div class="profile-container">
                <div class="profile-sidebar">
                    <div class="profile-avatar-large">
                        <?php echo strtoupper(substr($username, 0, 1)); ?>
                    </div>
                    <h2 style="color: var(--text-primary); margin-bottom: 0.5rem;"><?php echo htmlspecialchars($username); ?></h2>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">Medlem siden <?php echo date('d.m.Y'); ?></p>
                    
                    <div style="text-align: left;">
                        <h3 style="color: var(--accent-color); margin-bottom: 1rem;">Rask Statestikk</h3>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Rank:</span>
                            <span style="color: var(--accent-color); font-weight: bold;">#47</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Total Poeng:</span>
                            <span style="color: var(--accent-color); font-weight: bold;">8,924</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Spill Spilt:</span>
                            <span style="color: var(--accent-color); font-weight: bold;">47</span>
                        </div>
                    </div>
                </div>
                
                <div class="profile-main">
                    <h2 style="color: var(--text-primary); margin-bottom: 2rem;">Profil Innstillinger</h2>
                    
                    <div class="profile-stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">12</div>
                            <div class="stat-label">Dager i Rekke</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">76%</div>
                            <div class="stat-label">Gjennomsnitt</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">5</div>
                            <div class="stat-label">Topp 10 Plasseringer</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">3</div>
                            <div class="stat-label">Rekorder</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 2rem;">
                        <h3 style="color: var(--accent-color); margin-bottom: 1rem;">Innstillinger</h3>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <button class="btn btn-secondary">Endre Passord</button>
                            <button class="btn btn-secondary">Notifikasjoner</button>
                            <button class="btn btn-secondary">Språk</button>
                            <button class="btn" style="background: var(--error);">Slett Konto</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>
    <script src="script.js"></script>
</body>
</html>