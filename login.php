<?php
require_once 'includes/auth.php';
$auth = new Auth();

if($auth->isLoggedIn()) {
    header("Location: index.php");
    exit;
}

$error = '';
if($_POST) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    if($auth->login($username, $password)) {
        header("Location: index.php");
        exit;
    } else {
        $error = "Feil brukernavn eller passord!";
    }
}
?>
<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logg inn - MindMatrix</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="hexagon-background" id="hexagon-container"></div>
    
    <div class="auth-container">
        <h2 style="text-align: center; margin-bottom: 2rem;">Logg inn</h2>
        
        <?php if($error): ?>
            <div style="color: var(--error); margin-bottom: 1rem; text-align: center;"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label class="form-label">Brukernavn</label>
                <input type="text" name="username" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Passord</label>
                <input type="password" name="password" class="form-input" required>
            </div>
            
            <button type="submit" class="btn" style="width: 100%;">Logg inn</button>
        </form>
        
        <p style="text-align: center; margin-top: 1rem;">
            Har du ikke konto? <a href="signup.php" style="color: var(--accent-color);">Registrer deg her</a>
        </p>
    </div>

    <script src="script.js"></script>
</body>
</html>