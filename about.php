<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'includes/auth.php';
$auth = new Auth();
$isLoggedIn = $auth->isLoggedIn();
?>
<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Om Oss - MindMatrix</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="hexagon-background" id="hexagon-container"></div>

    <?php include 'includes/header.php'; ?>

    <main class="main-container">
        <div class="content-section">
            <h1 class="content-title">Om MindMatrix</h1>
            
            <div style="text-align: center; margin-bottom: 3rem;">
                <div style="font-size: 1.2rem; color: var(--text-secondary); line-height: 1.8; max-width: 800px; margin: 0 auto;">
                    MindMatrix er dedikert til å hjelpe mennesker med å trene og forbedre sine kognitive evner 
                    gjennom morsomme og engasjerende spill.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">Vårt Oppdrag</div>
                <div class="faq-answer">
                    Vi tror at alle kan forbedre sin hjernehelse gjennom regelmessig mental trening. 
                    Vårt mål er å gjøre kognitiv trening tilgjengelig, morsom og effektiv for alle.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">Vårt Team</div>
                <div class="faq-answer">
                    Vi er et team av spillutviklere, psykologer og nevrovitere som er lidenskapelig 
                    opptatt av hjernehelse og kognitiv utvikling.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question">Kontakt Oss</div>
                <div class="faq-answer">
                    Har du spørsmål eller tilbakemeldinger? Ta gjerne kontakt med oss på 
                    <a href="mailto:support@mindmatrix.com" style="color: var(--accent-color);">support@mindmatrix.com</a>
                </div>
            </div>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>
    <script src="script.js"></script>
</body>
</html>