<?php
require_once 'includes/auth.php';
$auth = new Auth();

if($auth->isLoggedIn()) {
    header("Location: index.php");
    exit;
}

$error = '';
$success = '';
if($_POST) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $email = $_POST['email'];
    $confirm_password = $_POST['confirm_password'];
    
    if($password !== $confirm_password) {
        $error = "Passordene er ikke like!";
    } elseif(strlen($password) < 6) {
        $error = "Passordet må være minst 6 tegn!";
    } else {
        if($auth->register($username, $password, $email)) {
            $success = "Konto opprettet! Du kan nå logge inn.";
        } else {
            $error = "Brukernavn eller e-post er allerede i bruk!";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrer deg - MindMatrix</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="hexagon-background" id="hexagon-container"></div>
    
    <div class="auth-container">
        <h2 style="text-align: center; margin-bottom: 2rem;">Registrer deg</h2>
        
        <?php if($error): ?>
            <div style="color: var(--error); margin-bottom: 1rem; text-align: center;"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <?php if($success): ?>
            <div style="color: var(--success); margin-bottom: 1rem; text-align: center;"><?php echo $success; ?></div>
        <?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label class="form-label">Brukernavn</label>
                <input type="text" name="username" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">E-post</label>
                <input type="email" name="email" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Passord</label>
                <input type="password" name="password" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Bekreft passord</label>
                <input type="password" name="confirm_password" class="form-input" required>
            </div>
            
            <button type="submit" class="btn" style="width: 100%;">Registrer deg</button>
        </form>
        
        <p style="text-align: center; margin-top: 1rem;">
            Har du allerede konto? <a href="login.php" style="color: var(--accent-color);">Logg inn her</a>
        </p>
    </div>

    <script src="script.js"></script>
</body>
</html>