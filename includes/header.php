<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'auth.php';
$auth = new Auth();
$isLoggedIn = $auth->isLoggedIn();
$username = $isLoggedIn ? $_SESSION['username'] : '';
?>
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